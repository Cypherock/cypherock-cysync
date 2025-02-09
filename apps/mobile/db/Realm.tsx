import { RealmProvider, Realm } from '@realm/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { createDB } from './db';
import { setDB } from '@/utils';

export const CustomRealmProvider = ({ children }: PropsWithChildren) => {
  const [database, setDatabase] = useState<Realm | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const dbInstance = await createDB();
      setDB(dbInstance);
      const realm = dbInstance.getRealm();
      if (realm) setDatabase(realm);
    };

    initializeDatabase();
  }, []);

  if (!database) {
    return null;
  }

  return <RealmProvider realm={database}>{children}</RealmProvider>;
};
