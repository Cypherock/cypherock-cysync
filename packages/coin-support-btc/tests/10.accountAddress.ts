import { IAccount } from '@cypherock/db-interfaces';
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { HDKey } from '@scure/bip32';
import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';

import { BtcSupport } from '../src';
import { getFirstUnusedAddress } from '../src/services';
import { deriveAccountAddress } from '../src/utils/accountAddress';

jest.mock('axios');
const mockedPost = axios.post as jest.MockedFunction<typeof axios.post>;

const H = 0x80000000;

/** BIP39 seed of "abandon abandon … about" with no passphrase. */
const SEED = Uint8Array.from(
  Buffer.from(
    '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc1' +
      '9a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
    'hex',
  ),
);

const accountXpub = (path: number[], version: number): string => {
  let node = HDKey.fromMasterSeed(SEED, {
    public: version,
    private: 0x0488ade4,
  });
  for (const index of path) node = node.deriveChild(index);
  return node.publicExtendedKey;
};

const makeAccount = (derivationPath: string, xpubOrAddress: string): IAccount =>
  ({
    name: 'Bitcoin 1',
    xpubOrAddress,
    derivationPath,
    assetId: 'bitcoin',
    familyId: 'bitcoin',
    parentAssetId: 'bitcoin',
    walletId: '00',
  } as any);

const LEGACY = makeAccount(
  "m/44'/0'/0'",
  accountXpub([44 + H, H, H], 0x0488b21e),
);
const NESTED = makeAccount(
  "m/49'/0'/0'",
  accountXpub([49 + H, H, H], 0x049d7cb2),
);
const NATIVE = makeAccount(
  "m/84'/0'/0'",
  accountXpub([84 + H, H, H], 0x04b24746),
);
const TAPROOT = makeAccount(
  "m/86'/0'/0'",
  `tr(${accountXpub([86 + H, H, H], 0x04b24746)})`,
);

describe('10. Account address check', () => {
  beforeAll(() => {
    BtcSupport.setBitcoinLibrary(bitcoin);
  });

  // First receive address of each BIP's published test vector.
  test.each([
    ['legacy', LEGACY, '1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA'],
    ['nested segwit', NESTED, '37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf'],
    ['native segwit', NATIVE, 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu'],
    [
      'taproot',
      TAPROOT,
      'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr',
    ],
  ])('derives the %s address from the account xpub', (_, account, address) => {
    expect(deriveAccountAddress(account, 0, 0)).toBe(address);
  });

  describe('getFirstUnusedAddress', () => {
    beforeEach(() => {
      mockedPost.mockReset();
    });

    const respond = (name: string, path: string) =>
      mockedPost.mockResolvedValueOnce({
        data: {
          tokens: [
            {
              name: 'bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g',
              path: "m/84'/0'/0'/0/1",
              transfers: 3,
            },
            { name, path, transfers: 0 },
          ],
        },
      });

    test('returns an unused address that belongs to the account', async () => {
      respond('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu', "m/84'/0'/0'/0/0");

      await expect(getFirstUnusedAddress(NATIVE, 'external')).resolves.toEqual({
        address: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu',
        derivationPath: "m/84'/0'/0'/0/0",
      });
    });

    test('rejects an address that is not derived from the account', async () => {
      // A valid address of another wallet, listed under this account's path.
      respond('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', "m/84'/0'/0'/0/0");

      await expect(getFirstUnusedAddress(NATIVE, 'external')).rejects.toThrow(
        'The address from the server does not belong to this account',
      );
    });

    test('rejects a change address listed under the wrong index', async () => {
      respond('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu', "m/84'/0'/0'/1/0");

      await expect(getFirstUnusedAddress(NATIVE, 'internal')).rejects.toThrow(
        'The address from the server does not belong to this account',
      );
    });
  });
});
