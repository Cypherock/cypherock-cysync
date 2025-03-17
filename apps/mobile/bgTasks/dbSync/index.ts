import React, { useEffect } from 'react';

import { syncAllDb, addListeners, removeListeners } from './helper';

export const DatabaseListener: React.FC = () => {
  useEffect(() => {
    syncAllDb();
    addListeners();

    return removeListeners;
  }, []);

  return null;
};
