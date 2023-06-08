import crypto from 'crypto';

export const encryptData = async (data: string, key: string) => {
  const algorithm = 'aes-256-cbc';

  const cipher = crypto.createCipher(algorithm, key);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

export const decryptData = async (data: string, key: string) => {
  const algorithm = 'aes-256-cbc';

  const decipher = crypto.createDecipher(algorithm, key);

  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
