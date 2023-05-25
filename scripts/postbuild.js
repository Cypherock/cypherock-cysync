const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const S3_URL = 's3://updater.cypherock.com/cysync-desktop';

const execCommand = command => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
        return;
      }

      resolve(stdout.trim());
    });
  });
};

const getArgs = () => {
  const CMD_ERROR_MSG =
    'Invalid command. Expected command: `node <file_name>.js <folder1,folder2...>`';

  const args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new Error(CMD_ERROR_MSG);
  }

  const foldernames = args[0];

  return { assetFolders: foldernames.split(',') };
};

const walk = directoryName => {
  const allFiles = [];
  const files = fs.readdirSync(directoryName);
  for (const file of files) {
    var fullPath = path.join(directoryName, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      allFiles.push(...walk(fullPath));
    } else {
      allFiles.push(fullPath);
    }
  }

  return allFiles;
};

const uploadAllAssets = async assetFolders => {
  let allAssets = [];
  for (const folder of assetFolders) {
    allAssets.push(...walk(path.join(__dirname, '..', folder)));
  }

  for (const asset of allAssets) {
    const assetName = path.basename(asset);

    console.log(`Uploading ${assetName}...`);
    await execCommand(`aws s3 cp "${asset}" "${S3_URL}/${assetName}"`);
    console.log(`Uploaded ${assetName}\n`);
  }
};

const run = async () => {
  try {
    const { assetFolders } = getArgs();

    await uploadAllAssets(assetFolders);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
