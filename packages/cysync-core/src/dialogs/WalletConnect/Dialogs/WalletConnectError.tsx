import { ErrorDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useWalletConnect } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletConnectError: React.FC = () => {
  const { errorTitle, errorSubtitle, connectionError, handleClose } =
    useWalletConnect();
  const lang = useAppSelector(selectLanguage);
  const { error } = lang.strings.walletConnect.common;
  return (
    <ErrorDialog
      title={errorTitle || error.title}
      subtext={errorSubtitle || error.subtitle}
      messageBoxText={connectionError}
      primaryActionText={lang.strings.buttons.exit}
      onPrimaryClick={handleClose}
      onClose={handleClose}
    />
  );
};
