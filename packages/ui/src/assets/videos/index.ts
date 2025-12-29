import cysyncDeviceConnectionAnimation2DVideo from './device-connection-animation-2d.webm';
import cysyncDistributeToLocationsAnimationVideo from './distribute-to-locations-animation.webm';
import enterSeedphraseAnimationVideo from './enter-seedphrase-animation.webm';
import odixDeviceConnectionAnimation2DVideo from './odix-device-connection-animation.png';
import odixDistributeToLocationsAnimationVideo from './odix-distribute-to-locations-animation.png';
import odixTapAllCardDeviceAnimation2DVideo from './odix-tap-card-device-animation.png';
import cysyncTapAllCardDeviceAnimation2DVideo from './tap-all-card-device-animation-2d.webm';
import cysyncTapAnyCardDeviceAnimation2DVideo from './tap-any-card-device-animation-2d.webm';

const deviceConnectionAnimation2DVideo =
  (window as any).cysyncEnv.VENDOR === 'odix'
    ? odixDeviceConnectionAnimation2DVideo
    : cysyncDeviceConnectionAnimation2DVideo;
const distributeToLocationsAnimationVideo =
  (window as any).cysyncEnv.VENDOR === 'odix'
    ? odixDistributeToLocationsAnimationVideo
    : cysyncDistributeToLocationsAnimationVideo;
const tapAllCardDeviceAnimation2DVideo =
  (window as any).cysyncEnv.VENDOR === 'odix'
    ? odixTapAllCardDeviceAnimation2DVideo
    : cysyncTapAllCardDeviceAnimation2DVideo;
const tapAnyCardDeviceAnimation2DVideo =
  (window as any).cysyncEnv.VENDOR === 'odix'
    ? odixTapAllCardDeviceAnimation2DVideo
    : cysyncTapAnyCardDeviceAnimation2DVideo;

export {
  deviceConnectionAnimation2DVideo,
  distributeToLocationsAnimationVideo,
  enterSeedphraseAnimationVideo,
  tapAllCardDeviceAnimation2DVideo,
  tapAnyCardDeviceAnimation2DVideo,
};
