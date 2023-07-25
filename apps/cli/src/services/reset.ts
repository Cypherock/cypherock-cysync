import { IDatabase } from '@cypherock/db-interfaces';

import { queryConfirm } from '~/utils';

export const resetData = async (db: IDatabase) => {
  const isConfirmed = await queryConfirm(
    'Are you sure you want to reset cli app?',
  );

  if (!isConfirmed) {
    return;
  }

  await db.clear();
};
