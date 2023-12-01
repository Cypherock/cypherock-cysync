function readPackage(pkg, context) {
  if (pkg.name === '@cypherock/sdk-hw-hid') {
    pkg.dependencies = {
      ...pkg.dependencies,
      'node-hid': '^3.0.0',
    };
    context.log('Updated node-hid version to 3.0');
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
