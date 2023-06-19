const path = require('path');

const watchDir = path.join(__dirname, '..', '..');

const watchIgnoreTerms = [
  'node_modules',
  '.git',
  '.turbo',
  'apps/desktop/release',
  'dist',
  'coverage',
  'submodules',
  'screenshots',
  'tests',
  'test-results',
  'playwright',
  '__fixtures__',
  '__helpers__',
  'e2e',
  'scripts',
  'docs',
];

const watchIgnoreExtensions = ['.log', '.txt'];

const watchFilter = file => {
  if (watchIgnoreTerms.some(term => file.includes(term))) {
    return false;
  }

  if (watchIgnoreExtensions.some(term => file.endsWith(term))) {
    return false;
  }

  return true;
};

const watchOptions = {
  ignoreDotFiles: true,
  filter: watchFilter,
  interval: 0.5,
};

const logColors = {
  watcher: 'bgGreen',
  builder: 'bgMagenta',
  cysync: 'bgCyan',
};

const runDesktopIgnoreLogTerms = ['[vite] hmr update', '[vite] page reload'];

module.exports = {
  watchOptions,
  watchDir,
  logColors,
  runDesktopIgnoreLogTerms,
  buildErrorLinesCount: 10,
  buildTimeWarnThreshold: 20,
  desktopLogLinePrefix: '@cypherock/cysync-desktop:dev:',
  preWatchScripts: ['pnpm dev:setup', 'pnpm build'],
  isVerbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  isLongLog: !(
    process.argv.includes('--short-log') || process.argv.includes('-s')
  ),
};
