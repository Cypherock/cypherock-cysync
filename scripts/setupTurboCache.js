const path = require('path');
const fs = require('fs');
const { config } = require('./helpers');

const API_URL = process.env.TURBO_API;
const TEAM = process.env.TURBO_TEAM;

const run = async () => {
  const turboFolderPath = path.join(config.ROOT_PATH, '.turbo');
  const configFilePath = path.join(turboFolderPath, 'config.json');

  if (!fs.existsSync(turboFolderPath)) {
    fs.mkdirSync(turboFolderPath);
  }

  fs.writeFileSync(
    configFilePath,
    JSON.stringify(
      {
        teamid: TEAM,
        apiurl: API_URL,
      },
      undefined,
      2,
    ),
  );
};

run();
