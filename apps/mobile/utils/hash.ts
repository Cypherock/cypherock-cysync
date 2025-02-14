import crypto from 'expo-crypto';

export interface CreateHashParams {
  value: string;
  salt: string | number;
}

export interface VerifyHashParams {
  value: string;
  hash: string;
}

const hashFunctions = {
  async hash(value: string, salt: string | number): Promise<string> {
    console.log('hash here');
    const digest = await crypto.digestStringAsync(
      crypto.CryptoDigestAlgorithm.SHA256,
      `${value}${salt}`,
    );
    console.log('nothing here');
    return `${salt}:${digest}`;
  },

  async compare(value: string, hashed: string): Promise<boolean> {
    const [salt, digest] = hashed.split(':');
    const computed = await crypto.digestStringAsync(
      crypto.CryptoDigestAlgorithm.SHA256,
      `${value}${salt}`,
    );
    return computed === digest;
  },
};

export const createHash = (params: CreateHashParams) =>
  hashFunctions.hash(params.value, params.salt);

export const verifyHash = (params: VerifyHashParams) =>
  hashFunctions.compare(params.value, params.hash);
