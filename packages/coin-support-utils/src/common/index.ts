export const mapDerivationPath = (derivationPath: string) => {
  const paths: number[] = [];

  const pathArr = derivationPath.split('/');

  for (const path of pathArr) {
    if (path !== 'm') {
      const isHardened = path.includes("'");
      let index = parseInt(path.replace("'", ''), 10);

      if (isHardened) {
        index += 0x80000000;
      }

      paths.push(index);
    }
  }

  return paths;
};
