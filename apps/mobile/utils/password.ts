import { createHash, verifyHash } from './hash';
import { keyValueStore } from '@/db';
import * as Crypto from 'expo-crypto';

const createHashKey = async (data: string) => {
  let hashed = data;
  for (let i = 0; i < 20; i++) {
    hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      hashed,
      { encoding: Crypto.CryptoEncoding.HEX },
    );
  }
  return hashed;
};

/** TODO: implementation incomplete */
const createDoubleHash = async (passHash: string): Promise<string> => passHash;

/** TODO: implementation incomplete */
const verifyDoubleHash = async (
  passHash: string,
  doubleHash: string,
): Promise<boolean> => passHash === doubleHash;

export const getPasswordHash = async () => {
  const passwordHash = await keyValueStore.passwordHash.get();

  return passwordHash;
};

export const isPasswordSet = async () => !!(await getPasswordHash());

export const verifyPassword = async (password?: string) => {
  const currentPasswordDoubleHash = await getPasswordHash();

  if (!currentPasswordDoubleHash) return true;

  if (!password) return false;

  const passHash = await createHashKey(password);

  const isCorrect = await verifyDoubleHash(passHash, currentPasswordDoubleHash);
  return isCorrect;
};

export const getEncryptionKey = async (password: string) =>
  createHashKey(password);

export const changePassword = async (password?: string) => {
  if (!password) {
    await keyValueStore.passwordHash.remove();
    return;
  }

  const passHash = await createHashKey(password);
  const doubleHash = await createDoubleHash(passHash);

  await keyValueStore.passwordHash.set(doubleHash);
};
