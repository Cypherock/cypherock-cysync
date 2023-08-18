import { createHash, decryptData, encryptData } from '../encryption';

describe('DB Encryption', () => {
  test('Should create hash from message', () => {
    const sampleMessage = 'sampleMessage';
    const expectedHashKey =
      '1241577c3bb040e87a647d60bf2b373a09afd40624add04ce7d00321d0bb4678';
    const hashBuffer = createHash(sampleMessage);
    const hashHex = hashBuffer.toString('hex');
    expect(hashHex).toEqual(expectedHashKey);
  });

  test('Should encrypt data using the provided key', async () => {
    const sampleData = 'sampleData';
    const sampleMessage = 'sampleMessage';
    const sampleKey = createHash(sampleMessage);

    const encryptedData = await encryptData(sampleData, sampleKey);
    expect(encryptedData).toMatch(/^[0-9a-fA-F]+\.[0-9a-fA-F]+$/);
  });

  test('Should produce different encrypted outputs for the same input and different keys', async () => {
    const sampleData = 'sampleData';
    const sampleMessage1 = 'sampleMessage1';
    const sampleMessage2 = 'sampleMessage2';
    const sampleKey1 = createHash(sampleMessage1);
    const sampleKey2 = createHash(sampleMessage2);

    const encryptedData1 = await encryptData(sampleData, sampleKey1);
    const encryptedData2 = await encryptData(sampleData, sampleKey2);

    expect(encryptedData1).not.toEqual(encryptedData2);
  });

  test('Should decrypt the given encrypted data', async () => {
    const sampleData = 'sampleData';
    const sampleMessage = 'sampleMessage';
    const sampleBuffer = createHash(sampleMessage);
    const encryptedData = await encryptData(sampleData, sampleBuffer);

    const decryptedData = await decryptData(encryptedData, sampleBuffer);
    expect(decryptedData).toEqual(sampleData);
  });
});
