const readline = require("readline/promises");
const path = require("path");
const fs = require("fs/promises");

const packages = {
	"apps/desktop": [
		"node_modules",
		"coverage",
		"dist",
		"dist-electron",
		".turbo",
		"release",
	],
	"packages/desktop-ui": ["node_modules", "coverage", "dist", ".turbo"],
	"packages/database": ["node_modules", "coverage", "dist", ".turbo"],
	"packages/db-interfaces": ["node_modules", "coverage", "dist", ".turbo"],
	"packages/util-eslint-config": ["node_modules"],
	"packages/util-prettier-config": ["node_modules"],
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const confirmFromUser = async (
	question,
	positiveResponse,
	negativeResponse
) => {
	let response = "";
	do {
		response = await rl.question(`${question}: `);

		if (negativeResponse.includes(response.toLowerCase())) {
			process.exit(1);
		}
	} while (!positiveResponse.includes(response.toLowerCase()));
};

const doExists = async (folderPath) => {
	try {
		await fs.access(folderPath);
		return true;
	} catch (error) {
		return false;
	}
};

const removeFolders = async (parentDirectory, folders) => {
	for (const folder of folders) {
		const folderPath = path.join(parentDirectory, folder);

		if (doExists(folderPath)) {
			console.log(`Deleting: ${folderPath}`);
			await fs.rm(folderPath, { recursive: true, force: true });
		}
	}
};

const run = async () => {
	const parentDir = path.join(__dirname, "..");
	const allFoldersToDelete = [];

	for (const pkgName in packages) {
		for (const folder of packages[pkgName]) {
			allFoldersToDelete.push(path.join(pkgName, folder));
		}
	}

	console.log(allFoldersToDelete);
	await confirmFromUser(
		"Do you want to delete all the above folders? (y/n)",
		["y", "yes"],
		["n", "no"]
	);

	console.log();
	console.log(`Working dir: ${parentDir}`);
	await confirmFromUser(
		`Please type the parent directory to confirm: (${path.basename(
			parentDir
		)}/n)`,
		[path.basename(parentDir)],
		["n", "no"]
	);

	await removeFolders(parentDir, allFoldersToDelete);

	rl.close();
};

run();
