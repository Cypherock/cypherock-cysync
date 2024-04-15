import { mapDerivationPath } from '../../../../src';

export const derivationPathAddressMap = new Map<number[], string>([
  [mapDerivationPath("m/44'/0'/0'/0/0"), 'address_44_0_0_0_0'],
  [mapDerivationPath("m/44'/0'/0'/0/1"), 'address_44_0_0_0_1'],
  [mapDerivationPath("m/44'/0'/0'/0/2"), 'address_44_0_0_0_2'],
  [mapDerivationPath("m/84'/0'/0'/0/0"), 'address_84_0_0_0_0'],
  [mapDerivationPath("m/84'/0'/0'/0/1"), 'address_84_0_0_0_1'],
  [mapDerivationPath("m/84'/0'/0'/0/2"), 'address_84_0_0_0_2'],
  [mapDerivationPath("m/49'/0'/0'/0/0"), 'address_49_0_0_0_0'],
  [mapDerivationPath("m/49'/0'/0'/0/1"), 'address_49_0_0_0_1'],
  [mapDerivationPath("m/49'/0'/0'/0/2"), 'address_49_0_0_0_2'],
]);
