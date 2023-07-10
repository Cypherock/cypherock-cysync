const withTurboBuild = require('./withTurbo');
const withoutTurboBuild = require('./withoutTurbo');

const doBuildWithTurbo = () => {
  return false;
};

module.exports = {
  ...(doBuildWithTurbo ? withTurboBuild : withoutTurboBuild),
};
