const lodash = require('lodash');
const config = require('./config');
const { getChalk } = require('./logger');

const logPaddings = {
  timestamp: 22,
  level: 10,
};

const logLevelColorMap = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
  verbose: 'cyan',
};

function flattenObject(o, prefix = '', result = {}, keepNull = true) {
  if (
    lodash.isString(o) ||
    lodash.isNumber(o) ||
    lodash.isBoolean(o) ||
    (keepNull && lodash.isNull(o))
  ) {
    result[prefix] = o;
    return result;
  }

  if (lodash.isArray(o) || lodash.isPlainObject(o)) {
    for (let i in o) {
      let pref = prefix;
      if (lodash.isArray(o)) {
        pref = pref + `[${i}]`;
      } else {
        if (lodash.isEmpty(prefix)) {
          pref = i;
        } else {
          pref = prefix + '.' + i;
        }
      }
      flattenObject(o[i], pref, result, keepNull);
    }
    return result;
  }
  return result;
}

const getJson = line => {
  try {
    const data = JSON.parse(line.trim());
    return data;
  } catch (error) {
    return undefined;
  }
};

const createParseLogLine = chalk => line => {
  try {
    const jsonLine = getJson(line);
    if (!jsonLine) return line;

    const log = flattenObject(jsonLine);
    let parsedLog = '';

    const timestamp = log.timestamp
      ? new Date(log.timestamp).toISOString().slice(0, -5)
      : 'UNKNOWN';

    const paddedTimestamp = lodash.padEnd(
      `[${timestamp}]`,
      logPaddings.timestamp,
      ' ',
    );
    parsedLog += chalk.green(paddedTimestamp);

    const level = log.level ?? 'UNKNOWN';
    const paddedLevel = lodash.padEnd(`[${log.level}]`, logPaddings.level, ' ');
    parsedLog += chalk[logLevelColorMap[level] ?? 'green'](paddedLevel);

    parsedLog += log.message;

    if (log.service) {
      parsedLog += chalk.blue(` (${log.service})`);
    }

    parsedLog += '\n';

    delete log.service;
    delete log.timestamp;
    delete log.level;
    delete log.message;

    if (config.isLongLog) {
      for (let key in log) {
        const spaces = lodash.padEnd(
          '',
          9 + logPaddings.timestamp + logPaddings.level,
          ' ',
        );
        parsedLog += chalk.cyan(`${spaces}${key}: `);
        parsedLog += `${log[key]}`;
        parsedLog += '\n';
      }
      parsedLog += '\n';
    }

    return parsedLog;
  } catch (error) {
    console.log(error);
    return line.trim();
  }
};

const parseRawLog = async log => {
  const chalk = await getChalk();
  const logs = log.split(config.desktopLogLinePrefix);
  const parsedLogs = logs.map(createParseLogLine(chalk)).filter(log => log);
  return parsedLogs;
};

module.exports = { parseRawLog };
