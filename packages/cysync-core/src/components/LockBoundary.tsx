import React from 'react';

import { useLockscreen } from '~/context';
import { Lockscreen } from '~/pages/Lockscreen';

export interface LockscreenBoundaryProps {
  children: React.ReactNode;
}

export const LockscreenBoundary: React.FC<LockscreenBoundaryProps> = ({
  children,
}) => {
  const { isLocked, isLockscreenLoading } = useLockscreen();

  if (isLocked) {
    return <Lockscreen />;
  }

  if (isLockscreenLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>Loading...</>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
