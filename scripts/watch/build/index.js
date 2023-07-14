const withTurboBuild = require('./withTurbo');
const withoutTurboBuild = require('./withoutTurbo');

const doBuildWithTurbo = () => {
  return process.argv.includes('--turbo') || process.argv.includes('-t');
};

module.exports = {
  ...(doBuildWithTurbo() ? withTurboBuild : withoutTurboBuild),
};
