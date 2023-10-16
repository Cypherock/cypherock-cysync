import { ErrorDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useWalletConnect } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletConnectError: React.FC = () => {
  const { errorTitle, errorSubtitle, connectionError, handleClose } =
    useWalletConnect();
  const lang = useAppSelector(selectLanguage);
  const { title, subtitle } = lang.strings.walletConnect.common.error.default;
  return (
    <ErrorDialog
      title={errorTitle || title}
      subtext={errorSubtitle || subtitle}
      messageBoxText={connectionError}
      primaryActionText={lang.strings.buttons.exit}
      onPrimaryClick={handleClose}
      onClose={handleClose}
    />
  );
};
