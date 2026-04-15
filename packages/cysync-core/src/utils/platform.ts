import {
  Platform,
  configurePlatform as configureCoreServicePlatform,
} from '@cypherock/cysync-core-services';

export const configurePlatform = (platform: Platform) => {
  configureCoreServicePlatform(platform);
};
