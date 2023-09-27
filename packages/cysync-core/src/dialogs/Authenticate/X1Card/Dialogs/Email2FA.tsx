import React from 'react';

import { Email2FA } from '../../components/Email2FA';
import { useAuthenticateX1CardDialog } from '../context';

export const X1CardEmail2FA: React.FC = () => {
  const context = useAuthenticateX1CardDialog();
  return <Email2FA {...context} />;
};
