import crypto from 'crypto';

export const createHash = (message: string): Buffer =>
  crypto.createHash('sha256').update(message).digest();

export const encryptData = async (data: string, key: Buffer) => {
  const algorithm = 'aes-256-cbc';

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}.${encrypted}`;
};

export const decryptData = async (data: string, key: Buffer) => {
  const algorithm = 'aes-256-cbc';
  const [iv, encryptedData] = data.split('.');

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex'),
  );

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
