import { mapDerivationPath } from '../../src';

const derivationPathAddressMap = new Map<string, string>();

const pathAddressList = [
  ["m/44'/0'/0'/0/0", 'address_44_0_0_0_0'],
  ["m/44'/0'/0'/0/1", 'address_44_0_0_0_1'],
  ["m/44'/0'/0'/0/2", 'address_44_0_0_0_2'],
  ["m/84'/0'/0'/0/0", 'address_84_0_0_0_0'],
  ["m/84'/0'/0'/0/1", 'address_84_0_0_0_1'],
  ["m/84'/0'/0'/0/2", 'address_84_0_0_0_2'],
  ["m/49'/0'/0'/0/0", 'address_49_0_0_0_0'],
  ["m/49'/0'/0'/0/1", 'address_49_0_0_0_1'],
  ["m/49'/0'/0'/0/2", 'address_49_0_0_0_2'],
];

const putPathAddressEntry = (path: string, address: string) => {
  derivationPathAddressMap.set(mapDerivationPath(path).join('#'), address);
};

pathAddressList.forEach(([path, address]) => {
  putPathAddressEntry(path, address);
});

export const getAddressFromPath = (path: number[]) =>
  derivationPathAddressMap.get(path.join('#'));
