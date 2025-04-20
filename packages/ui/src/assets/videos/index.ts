import cysyncDeviceConnectionAnimation2DVideo from './device-connection-animation-2d.webm';
import distributeToLocationsAnimationVideo from './distribute-to-locations-animation.webm';
import enterSeedphraseAnimationVideo from './enter-seedphrase-animation.webm';
import tapAllCardDeviceAnimation2DVideo from './tap-all-card-device-animation-2d.webm';
import tapAnyCardDeviceAnimation2DVideo from './tap-any-card-device-animation-2d.webm';

const deviceConnectionAnimation2DVideo =
  (window as any).cysyncEnv.VENDOR === 'odix'
    ? distributeToLocationsAnimationVideo // Example of changing videos according to vendor
    : cysyncDeviceConnectionAnimation2DVideo;

export {
  deviceConnectionAnimation2DVideo,
  distributeToLocationsAnimationVideo,
  enterSeedphraseAnimationVideo,
  tapAllCardDeviceAnimation2DVideo,
  tapAnyCardDeviceAnimation2DVideo,
};
