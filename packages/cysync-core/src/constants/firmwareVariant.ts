import { FirmwareVariant } from '@cypherock/sdk-app-manager';

export const FIRMWARE_VARIANT_DISPLAY_NAMES: Record<FirmwareVariant, string> = {
  [FirmwareVariant.MULTI_COIN]: 'Multi',
  [FirmwareVariant.BTC_ONLY]: 'Bitcoin-only',
  [FirmwareVariant.UNRECOGNIZED]: 'Unknown',
};

export const getFirmwareVariantDisplayName = (
  variant: FirmwareVariant,
): string => FIRMWARE_VARIANT_DISPLAY_NAMES[variant] || 'Unknown';
