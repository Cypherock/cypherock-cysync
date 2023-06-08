import { Sha256 } from '@aws-crypto/sha256-browser';
import bcrypt from 'bcryptjs';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { getKeyDB } from './db';

const PASSWORD_KEY = 'password';

const createHash = async (data: string | Uint8Array) => {
  const hash = new Sha256();
  hash.update(data);
  const result = await hash.digest();

  return uint8ArrayToHex(result);
};

const createDoubleHash = async (passHash: string): Promise<string> =>
  bcrypt.hash(passHash, 16);

const verifyDoubleHash = async (
  passHash: string,
  doubleHash: string,
): Promise<boolean> => bcrypt.compare(passHash, doubleHash);

export const getPasswordHash = async () => {
  const db = getKeyDB();
  const passwordHash = await db.getItem(PASSWORD_KEY);

  return passwordHash;
};

export const isPasswordSet = async () => !!(await getPasswordHash());

export const verifyPassword = async (password?: string) => {
  const currentPasswordDoubleHash = await getPasswordHash();

  if (!currentPasswordDoubleHash) return true;

  if (!password) return false;

  const passHash = await createHash(password);

  const isCorrect = await verifyDoubleHash(passHash, currentPasswordDoubleHash);

  return isCorrect;
};

export const getEncryptionKey = async (password: string) =>
  createHash(password);

export const changePassword = async (password?: string) => {
  const db = getKeyDB();

  if (!password) {
    await db.removeItem(PASSWORD_KEY);
    return;
  }

  const passHash = await createHash(password);
  const doubleHash = await createDoubleHash(passHash);

  await db.setItem(PASSWORD_KEY, doubleHash);
};
