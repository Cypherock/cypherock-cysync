import { runMigrations } from '@cypherock/cysync-core-services';
import React, { useEffect, useMemo, useState } from 'react';

import { getDB, passwordUtils } from '~/utils';
import logger from '~/utils/logger';

export interface LockscreenContextInterface {
  isLocked: boolean;
  isLockscreenLoading: boolean;
  isPasswordSet: boolean;
  lock: () => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  setPassword: (
    password?: string,
    existingPassword?: string,
  ) => Promise<boolean>;
}

export const LockscreenContext: React.Context<LockscreenContextInterface> =
  React.createContext<LockscreenContextInterface>(
    {} as LockscreenContextInterface,
  );

export interface LockscreenProviderProps {
  children: React.ReactNode;
}

export const LockscreenProvider: React.FC<LockscreenProviderProps> = ({
  children,
}) => {
  const [isLockscreenLoading, setIsLockscreenLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  const loadDB = async (encryptionKey?: string) => {
    await getDB().load(encryptionKey);
    await runMigrations(getDB());
  };

  const checkIfLocked = async () => {
    const hasPassword = await passwordUtils.isPasswordSet();
    if (!hasPassword) {
      await loadDB();
    }

    logger.info('Application lock status', { hasPassword });

    setIsLocked(hasPassword);
    setIsPasswordSet(hasPassword);
    setIsLockscreenLoading(false);
  };

  useEffect(() => {
    checkIfLocked();
  }, []);

  const lock = async () => {
    await getDB().unload();
    setIsLocked(true);
  };

  const unlock = async (password: string) => {
    const isPasswordCorrect = await passwordUtils.verifyPassword(password);

    if (!isPasswordCorrect) {
      logger.info('Incorrect password entered while unlocking');
      return false;
    }

    const encryptionKey = await passwordUtils.getEncryptionKey(password);
    await loadDB(encryptionKey);
    setIsLocked(false);

    return true;
  };

  const setPassword = async (password?: string, existingPassword?: string) => {
    const isPasswordCorrect = await passwordUtils.verifyPassword(
      existingPassword,
    );

    if (!isPasswordCorrect) {
      logger.info('Incorrect password entered while changing password');
      return false;
    }

    await passwordUtils.changePassword(password);
    const db = getDB();

    if (password) {
      const encryptionKey = await passwordUtils.getEncryptionKey(password);
      await db.changeEncryptionKey(encryptionKey);
      setIsPasswordSet(true);
      logger.info('Password successfully changed');
    } else {
      await db.changeEncryptionKey(undefined);
      setIsPasswordSet(false);
      logger.info('Password removed');
    }

    return true;
  };

  const ctx = useMemo(
    () => ({
      isLocked,
      isLockscreenLoading,
      isPasswordSet,
      lock,
      unlock,
      setPassword,
    }),
    [isLocked, isLockscreenLoading, isPasswordSet, lock, unlock, setPassword],
  );

  return (
    <LockscreenContext.Provider value={ctx}>
      {children}
    </LockscreenContext.Provider>
  );
};

export function useLockscreen(): LockscreenContextInterface {
  return React.useContext(LockscreenContext);
}
