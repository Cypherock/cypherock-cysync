import { testData } from '../__fixtures__';
import { createHash, decryptData, encryptData } from '../encryption';

const { valid: validTestData } = testData;

describe('DB Encryption', () => {
  test('Should create hash from message', () => {
    expect(
      createHash(validTestData.hashing[0].message).toString('hex'),
    ).toEqual(validTestData.hashing[0].expectedHashKey);
  });

  test('Should create hash from empty message', () => {
    expect(
      createHash(validTestData.hashing[1].message).toString('hex'),
    ).toEqual(validTestData.hashing[1].expectedHashKey);
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
      const encryptedData1 = await encryptData(data[0], createHash(message[0]));
      const encryptedData2 = await encryptData(data[1], createHash(message[1]));
      expect(encryptedData1).not.toEqual(encryptedData2);
    }
  });

  // test('Should handle invalid data', async () => {
  //   invalidTestData.encryption.forEach(async item => {
  //     if (!item.data && item.message)
  //       await expect(
  //         encryptData(item.data, createHash(item.message[0])),
  //       ).rejects.toThrow();
  //   });
  // });

  // test('Should handle invalid key', async () => {
  //   invalidTestData.encryption.forEach(async item => {
  //     if (item.data && !item.message)
  //       await expect(
  //         encryptData(item.data[0], createHash(item.message as any)),
  //       ).rejects.toThrow();
  //   });
  // });

  test('Should decrypt the given encrypted data', async () => {
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
});
