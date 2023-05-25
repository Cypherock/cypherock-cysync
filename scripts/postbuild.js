const path = require('path');
const fs = require('fs');

const {
  config,
  getReleaseParams,
  genReleaseNotes,
  execCommand,
} = require('./helpers');

const S3_URL = config.S3_URL;

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

const getAssetFiles = assetFolders => {
  let allAssets = [];
  for (const folder of assetFolders) {
    allAssets.push(...walk(path.join(__dirname, '..', folder)));
  }

  return allAssets;
};

const uploadAllAssets = async allAssets => {
  console.log(allAssets);

  for (const asset of allAssets) {
    const assetName = path.basename(asset);

    console.log(asset);
    console.log(`Uploading ${assetName}...`);
    // await execCommand(`aws s3 cp "${asset}" "${S3_URL}/${assetName}"`);
    console.log(`Uploaded ${assetName}\n`);
  }
};

const updateReleaseSummary = async (params, allAssets) => {
  // TODO: Add release summary to server
};

const createGithubRelease = async (params, allAssets) => {
  // Don't upload YML files to github
  const filteredAssets = allAssets.filter(a => !a.endsWith('yml'));

  const releaseNotesPath = await genReleaseNotes();

  await execCommand(
    `gh release create ${params.tagName} -F "${releaseNotesPath}" --verify-tag`,
  );
  await execCommand(
    `gh release upload ${params.tagName} ${filteredAssets
      .map(e => `"${e}"`)
      .join(' ')}`,
  );
};

const run = async () => {
  try {
    const { assetFolders } = getArgs();

    let allAssets = getAssetFiles(assetFolders);
    await uploadAllAssets(allAssets);

    const params = await getReleaseParams();

    if (params.channel === config.RELEASE_CHANNEL) {
      await createGithubRelease(params, allAssets);
    }

    await updateReleaseSummary(params, allAssets);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
