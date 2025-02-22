import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getDB } from '@/utils';
import * as passwordUtils from '@/utils/password';

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
  removePassword: () => Promise<boolean>;
}

export const LockscreenContext: React.Context<LockscreenContextInterface> =
  createContext<LockscreenContextInterface>({} as LockscreenContextInterface);

export interface LockscreenProviderProps {
  children: React.ReactNode;
}

/** TODO: implementation incomplete */
export const LockscreenProvider: React.FC<LockscreenProviderProps> = ({
  children,
}) => {
  const [isLockscreenLoading, setIsLockscreenLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  /** TODO: implementation incomplete */
  const loadDB = async (encryptionKey?: string) => {
    await getDB().load(encryptionKey);
  };

  const checkIfLocked = async () => {
    const hasPassword = await passwordUtils.isPasswordSet();
    if (!hasPassword) {
      await loadDB();
    }

    console.info('Application lock status', { hasPassword });

    setIsLocked(hasPassword);
    setIsPasswordSet(hasPassword);
    setIsLockscreenLoading(false);
  };

  useEffect(() => {
    checkIfLocked().catch(e => {
      throw e;
    });
  }, []);

  const lock = async () => {
    await getDB().unload();
    setIsLocked(true);
  };

  const unlock = async (password: string) => {
    const isPasswordCorrect = await passwordUtils.verifyPassword(password);

    if (!isPasswordCorrect) {
      console.info('Incorrect password entered while unlocking');
      return false;
    }

    const encryptionKey = await passwordUtils.getEncryptionKey(password);
    await loadDB(encryptionKey);
    setIsLocked(false);

    return true;
  };

  const setPassword = async (password?: string, existingPassword?: string) => {
    const isPasswordCorrect =
      await passwordUtils.verifyPassword(existingPassword);

    if (!isPasswordCorrect) {
      console.info('Incorrect password entered while changing password');
      return false;
    }

    await passwordUtils.changePassword(password);
    const db = getDB();

    if (password) {
      const encryptionKey = await passwordUtils.getEncryptionKey(password);
      await db.changeEncryptionKey(encryptionKey);
      setIsPasswordSet(true);
      console.info('Password successfully changed');
    } else {
      await db.changeEncryptionKey(undefined);
      setIsPasswordSet(false);
      console.info('Password removed');
    }

    return true;
  };

  /**
   * Removes the password from the database without requiring authentication.
   *
   * This method is considered unsafe as it bypasses the usual password verification
   * process, potentially exposing sensitive data. Use with extreme caution and only
   * after careful consideration and discussion of its implications.
   *
   * @returns A Promise that resolves to true if the password removal was successful.
   *
   * @remarks
   * - This operation unloads the current encryption context, making the database accessible
   *   without a password.
   * - It is intended to be an emergency or recovery option, not a standard method for password management.
   */
  const removePassword = async () => {
    await passwordUtils.changePassword();
    const db = getDB();
    await db.changeEncryptionKey(undefined);
    setIsPasswordSet(false);
    setIsLocked(false);
    console.info('Password removed');
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
      removePassword,
    }),
    [
      isLocked,
      isLockscreenLoading,
      isPasswordSet,
      lock,
      unlock,
      setPassword,
      removePassword,
    ],
  );

  return (
    <LockscreenContext.Provider value={ctx}>
      {children}
    </LockscreenContext.Provider>
  );
};

export function useLockscreen(): LockscreenContextInterface {
  const context = useContext(LockscreenContext);
  if (!context) {
    throw new Error(
      'useLockscreenContext must be used within a LockscreenProvider',
    );
  }
  return context;
}
