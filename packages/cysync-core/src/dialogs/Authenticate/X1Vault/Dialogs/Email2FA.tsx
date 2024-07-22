import React from 'react';

import { Email2FA } from '../../components/Email2FA';
import { useAuthenticateX1VaultDialog } from '../context';

export const X1VaultEmail2FA: React.FC = () => {
  const context = useAuthenticateX1VaultDialog();
  return <Email2FA {...context} />;
};
