import { Sha256 } from '@aws-crypto/sha256-browser';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

import { createBcryptHash, verifyBcryptHash } from './bcrypt';
import { keyValueStore } from './keyValueStore';

//! Not meant to be used by UI, see: useLockscreen
//
const createHash = async (data: string) => {
  let encoded = new TextEncoder().encode(data);

  for (let i = 0; i < 20; i += 1) {
    const hash = new Sha256();
    hash.update(data);
    encoded = await hash.digest();
  }

  return uint8ArrayToHex(encoded);
};

const createDoubleHash = async (passHash: string): Promise<string> =>
  createBcryptHash({ value: passHash, salt: 16 });

const verifyDoubleHash = async (
  passHash: string,
  doubleHash: string,
): Promise<boolean> => verifyBcryptHash({ value: passHash, hash: doubleHash });

export const getPasswordHash = async () => {
  const passwordHash = await keyValueStore.passwordHash.get();

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
  if (!password) {
    await keyValueStore.passwordHash.remove();
    return;
  }

  const passHash = await createHash(password);
  const doubleHash = await createDoubleHash(passHash);

  await keyValueStore.passwordHash.set(doubleHash);
};
