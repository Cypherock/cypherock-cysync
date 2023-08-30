import { testData } from '../__fixtures__';
import { createHash, decryptData, encryptData } from '../encryption';

const { hashing, encryption, decryption } = testData;

describe('Hashing', () => {
  test('Should create hash the valid values', () => {
    const { valid: validTestCases } = hashing;

    validTestCases.forEach(item => {
      if (item.expectedHashKey && item.message) {
        expect(createHash(item.message).toString('hex')).toEqual(
          item.expectedHashKey,
        );
      }
    });
  });

  test('Should not create hash the invalid values', () => {
    const { invalid: invalidTestCases } = hashing;

    invalidTestCases.forEach(item => {
      expect(() => {
        createHash(item as any);
      }).toThrow();
    });
  });
});

describe('Encryption', () => {
  test('Should encrypt valid data', async () => {
    const { valid: validTestCases } = encryption;

    for (const testCase of validTestCases) {
      const { data, key } = testCase;

      for (let i = 0; i < data.length; i += 1) {
        const _data = data[i];
        const _key = key[i];
        if (_data && _key) {
          if (_data.length === 1 && _key.length === 1) {
            const encryptedData = encryptData(_data, createHash(_key));
            expect(encryptedData).toMatch(/^[0-9a-fA-F]+\.[0-9a-fA-F]+$/);
          } else {
            const encryptedData1 = await encryptData(_data, createHash(_key));
            const encryptedData2 = await encryptData(_data, createHash(_key));
            expect(encryptedData1).not.toEqual(encryptedData2);
          }
        }
      }
    }
  });

  test('Should not encrypt invalid data', async () => {
    const { invalid: invalidTestCases } = encryption;

    for (const testCase of invalidTestCases) {
      const { data, key } = testCase;

      for (let i = 0; i < data.length; i += 1) {
        const _data = data[i];
        const _key = key[i];

        if (_key) {
          await expect(
            encryptData(data as any, createHash(_key)),
          ).rejects.toThrow();
        } else if (_data) {
          await expect(encryptData(_data, _key as any)).rejects.toThrow();
        }
      }
    }
  });
});

describe('Decryption', () => {
  test('Should decrypt with valid decryption key', async () => {
    const { valid: validTestCases } = decryption;

    for (const testCase of validTestCases) {
      const { data, key, decryptionKey } = testCase;

      for (let i = 0; i < data.length; i += 1) {
        const _data = data[i];
        const _key = key[i];
        const _decryptionKey = decryptionKey[i];

        if (_data && _key && _decryptionKey) {
          const encryptedData = await encryptData(_data, createHash(_key));
          const decryptedData = await decryptData(
            encryptedData,
            createHash(_decryptionKey),
          );
          expect(decryptedData).toEqual(data[i]);
        }
      }
    }
  });

  test('Should not decrypt with invalid decryption key', async () => {
    const { valid: validTestCases } = decryption;

    for (const testCase of validTestCases) {
      const { data, key, decryptionKey } = testCase;

      for (let i = 0; i < data.length; i += 1) {
        const _data = data[i];
        const _key = key[i];
        const _decryptionKey = decryptionKey[i];

        if (_data && _key && _decryptionKey) {
          const encryptedData = await encryptData(
            _data as any,
            createHash(_key as any),
          );

          expect(
            decryptData(encryptedData, createHash(_decryptionKey as any)),
          ).not.toEqual(_data);
        }
      }
    }
  });
});
