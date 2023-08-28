import { testData } from '../__fixtures__';
import { createHash, decryptData, encryptData } from '../encryption';

const { valid: validTestData, invalid: invalidTestData } = testData;

describe('DB Encryption', () => {
  test('Should create hash from message', () => {
    const { message, expectedHashKey } = validTestData.hashing[0];
    if (message && expectedHashKey)
      expect(createHash(message).toString('hex')).toEqual(expectedHashKey);
  });

  test('Should create hash from empty message', () => {
    const { message, expectedHashKey } = validTestData.hashing[1];
    if (message && expectedHashKey)
      expect(createHash(message).toString('hex')).toEqual(expectedHashKey);
  });

  test('Should not hash invalid values', () => {
    for (const item of invalidTestData.hashing) {
      expect(() => {
        createHash(item as any);
      }).toThrow();
    }
  });

  test('Should encrypt data using the provided key', async () => {
    const { data, message } = validTestData.encryption[0];

    if (data && message) {
      const encryptedData = await encryptData(data[0], createHash(message[0]));
      expect(encryptedData).toMatch(/^[0-9a-fA-F]+\.[0-9a-fA-F]+$/);
    }
  });

  test('Should produce different encrypted outputs for the different inputs and same keys', async () => {
    const { data, message } = validTestData.encryption[1];

    if (data && message) {
      const encryptedData1 = await encryptData(data[0], createHash(message[0]));
      const encryptedData2 = await encryptData(data[1], createHash(message[0]));
      expect(encryptedData1).not.toEqual(encryptedData2);
    }
  });

  test('Should produce different encrypted outputs for the same inputs and different keys', async () => {
    const { data, message } = validTestData.encryption[2];

    if (data && message) {
      const encryptedData1 = await encryptData(data[0], createHash(message[0]));
      const encryptedData2 = await encryptData(data[0], createHash(message[1]));
      expect(encryptedData1).not.toEqual(encryptedData2);
    }
  });

  test('Should produce different encrypted outputs for the same input and same keys', async () => {
    const { data, message } = validTestData.encryption[0];

    if (data && message) {
      const encryptedData1 = await encryptData(data[0], createHash(message[0]));
      const encryptedData2 = await encryptData(data[0], createHash(message[0]));
      expect(encryptedData1).not.toEqual(encryptedData2);
    }
  });

  test('Should produce different encrypted outputs for the different input and different keys', async () => {
    const { data, message } = validTestData.encryption[3];

    if (data && message) {
      const encryptedData1 = await encryptData(
        data[0] as string,
        createHash(message[0]),
      );
      const encryptedData2 = await encryptData(
        data[1] as string,
        createHash(message[1]),
      );
      expect(encryptedData1).not.toEqual(encryptedData2);
    }
  });

  test('Should handle invalid data', async () => {
    for (const item of invalidTestData.encryption) {
      if (!item.data && item.message)
        await expect(
          encryptData(item.data as any, createHash(item.message[0])),
        ).rejects.toThrow();
    }
  });

  test('Should handle invalid key', async () => {
    for (const item of invalidTestData.encryption) {
      if (item.data && !item.message)
        await expect(
          encryptData(item.data[0], item.message as any),
        ).rejects.toThrow();
    }
  });

  test('Should decrypt with valid decryption key', async () => {
    const { data, message } = validTestData.encryption[0];

    if (data && message) {
      const encryptedData = await encryptData(data[0], createHash(message[0]));
      const decryptedData = await decryptData(
        encryptedData,
        createHash(message[0]),
      );
      expect(decryptedData).toEqual(data[0]);
    }
  });

  test('Should not decrypt with invalid decryption key', async () => {
    const { data, message } = validTestData.encryption[0];

    if (data && message) {
      const encryptedData = await encryptData(data[0], createHash(message[0]));
      await expect(
        decryptData(encryptedData, createHash('invalidMessage')),
      ).rejects.toThrow();
    }
  });
});
