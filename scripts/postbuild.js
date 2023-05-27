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
  for (const asset of allAssets) {
    const assetName = path.basename(asset);

    console.log(`Uploading ${assetName}...`);
    await execCommand(`aws s3 cp "${asset}" "${S3_URL}/${assetName}"`);
    console.log(`Uploaded ${assetName}\n`);
  }
};

const createGithubRelease = async (params, allAssets) => {
  const tagName = `${config.APP_NAME}@${params.version.version}`;

  console.log(`Adding tag ${tagName}...`);
  await execCommand(`git tag ${tagName}`);
  console.log(`Pushing tag...`);
  try {
    await execCommand(`git push -u origin ${tagName}`);
  } catch (error) {
    // For some reason, the above script exits with error code even when successful
    console.warn(error);
  }

  console.log(`Pushed tag`);

  if (config.CHANNEL === config.RELEASE_CHANNEL) {
    console.log('Creating a github release...');
    // Don't upload YML files to github
    const filteredAssets = allAssets.filter(a => !a.endsWith('yml'));
    console.log(filteredAssets);

    const releaseNotesPath = await genReleaseNotes();
    console.log(releaseNotesPath);

    await execCommand(`gh release create ${tagName} -F "${releaseNotesPath}"`);
    console.log('Uploading github release assets...');
    await execCommand(
      `gh release upload ${tagName} ${filteredAssets
        .map(e => `"${e}"`)
        .join(' ')}`,
    );
  }
};

const run = async () => {
  try {
    const { assetFolders } = getArgs();

    const params = await getReleaseParams();

    if (params.channel !== config.CHANNEL) {
      throw new Error(
        `Channel in package.json (${params.channel}) does not match with the workflow (${config.CHANNEL})`,
      );
    }

    let allAssets = getAssetFiles(assetFolders);

    await uploadAllAssets(allAssets);
    await createGithubRelease(params, allAssets);
  } catch (error) {
    console.log('Postscript failed', { error });
    console.error(error);
    process.exit(1);
  }
};

run();
