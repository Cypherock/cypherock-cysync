const getSuccessfulTaskCount = log => {
  const textAfterTasks = log.split('tasks:')[1];
  if (!textAfterTasks) return undefined;

  const textBeforeSuccessful = textAfterTasks.split('successful')[0].trim();
  if (isNaN(textBeforeSuccessful)) return undefined;

  return Number(textBeforeSuccessful);
};

const getTotalTaskCount = log => {
  const textAfterSuccessful = log.split('successful,')[1];
  if (!textAfterSuccessful) return undefined;

  const textBeforeTotal = textAfterSuccessful.split('total')[0].trim();
  if (isNaN(textBeforeTotal)) return undefined;

  return Number(textBeforeTotal);
};

const getCachedTaskCount = log => {
  const textAfterCached = log.split('cached:')[1];
  if (!textAfterCached) return undefined;

  const textBeforeCached = textAfterCached.split('cached,')[0].trim();
  if (isNaN(textBeforeCached)) return undefined;

  return Number(textBeforeCached);
};

const parseTurboLogs = logs => {
  let totalTasks = '';
  let successfulTasks = '';
  let cachedTasks = '';

  for (const rawLog of logs) {
    const log = rawLog.trim().toLowerCase();
    if (log.startsWith('tasks:')) {
      totalTasks = getTotalTaskCount(log);
      successfulTasks = getSuccessfulTaskCount(log);
      cachedTasks = getCachedTaskCount(log);
    } else if (log.startsWith('cached:')) {
      cachedTasks = getCachedTaskCount(log);
    }
  }

  return {
    totalTasks,
    cachedTasks,
    successfulTasks,
  };
};

module.exports = { parseTurboLogs };
