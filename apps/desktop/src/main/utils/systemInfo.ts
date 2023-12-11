import si from 'systeminformation';

const getSystemInfo = async () => {
  const { model } = await si.system();
  const { platform, distro, release, codename, kernel, arch, uefi } =
    await si.osInfo();
  const { controllers, displays } = await si.graphics();
  const {
    manufacturer,
    brand,
    vendor,
    family,
    cores,
    physicalCores,
    processors,
  } = await si.cpu();

  return {
    model,
    platform,
    distro,
    release,
    codename,
    kernel,
    arch,
    uefi,
    controllers,
    displays,
    manufacturer,
    brand,
    vendor,
    family,
    cores,
    physicalCores,
    processors,
  };
};

export { getSystemInfo };
