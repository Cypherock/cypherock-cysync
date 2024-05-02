import { testData } from '../__fixtures__';
import { createHash, decryptData, encryptData } from '../encryption';

const { hashing, encryption, decryption } = testData;

describe('createHash', () => {
  test('Should create hash with valid values', () => {
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
  test('Should create the same hash for the same input', () => {
    const message = 'sampleMessage';
    const hash1 = createHash(message).toString('hex');
    const hash2 = createHash(message).toString('hex');

    expect(hash1).toEqual(hash2);
  });
});

describe('encryptData', () => {
  describe('Should encrypt valid data', () => {
    encryption.valid.forEach(testCase => {
      testCase.data.forEach((data, index) => {
        const key = testCase.key[index];
        if (data && key) {
          if (data.length === 1 && key.length === 1) {
            test(`Data: ${data}, Key: ${key}`, () => {
              const encryptedData = encryptData(data, createHash(key));
              expect(encryptedData).toMatch(/^[0-9a-fA-F]+\.[0-9a-fA-F]+$/);
            });
          } else {
            test(`Data: ${data}, Key: ${key}`, async () => {
              const encryptedData1 = await encryptData(data, createHash(key));
              const encryptedData2 = await encryptData(data, createHash(key));
              expect(encryptedData1).not.toEqual(encryptedData2);
            });
          }
        }
      });
    });
  });

  describe('Should not encrypt invalid data', () => {
    encryption.invalid.forEach(testCase => {
      testCase.data.forEach((data, index) => {
        const key = testCase.key[index];
        test(`Data: ${data}, Key: ${key}`, async () => {
          if (key) {
            const hashedKey = createHash(key);
            if (typeof data !== 'string') {
              await expect(
                encryptData(data as any, hashedKey),
              ).rejects.toThrow();
            } else if (data === '') {
              await expect(encryptData(data, hashedKey)).rejects.toThrow();
            }
          } else {
            await expect(
              encryptData(data as any, key as any),
            ).rejects.toThrow();
          }
        });
      });
    });
  });
});

describe('decryptData', () => {
  describe('Should decrypt with valid decryption key', () => {
    decryption.valid.forEach(testCase => {
      testCase.data.forEach((data, index) => {
        const key = testCase.key[index];
        const decryptionKey = testCase.decryptionKey[index];

        test(`Data: ${data}, Key: ${key}, Decryption Key: ${decryptionKey}`, async () => {
          if (data && key && decryptionKey) {
            const encryptedData = await encryptData(data, createHash(key));
            const decryptedData = await decryptData(
              encryptedData,
              createHash(decryptionKey),
            );
            expect(decryptedData).toEqual(data);
          }
        });
      });
    });
  });

  describe('Should not decrypt with invalid decryption key', () => {
    decryption.invalid.forEach(testCase => {
      testCase.data.forEach((data, index) => {
        const key = testCase.key[index];
        const decryptionKey = testCase.decryptionKey[index];

        test(`Data: ${data}, Key: ${key}, Decryption Key: ${decryptionKey}`, async () => {
          if (data && key && decryptionKey) {
            const encryptedData = await encryptData(data, createHash(key));
            await expect(
              decryptData(encryptedData, createHash(decryptionKey)),
            ).rejects.toThrow();
          }
        });
      });
    });
  });
});
