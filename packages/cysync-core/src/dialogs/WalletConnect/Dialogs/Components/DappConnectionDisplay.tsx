import {
  Container,
  DappConnectedLogo,
  LangDisplay,
  Typography,
  WalletConnectLogo,
  cysyncLogoSmall,
  Image,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletConnect } from '~/context';

export const DappConnectionDisplay: FC<{
  title: string;
  connected?: boolean;
}> = ({ title, connected }) => {
  const { connectionClientMeta } = useWalletConnect();

  return (
    <Container display="flex" direction="column" gap={32} py={4} px={5}>
      {!connected && (
        <DappConnectedLogo
          walletConnectLogo={WalletConnectLogo}
          cySyncLogo={cysyncLogoSmall}
          dappLogoUrl={connectionClientMeta?.icons?.[0] ?? ''}
        />
      )}
      {connected && (
        <Image
          src={connectionClientMeta?.icons?.[0] ?? ''}
          alt="Send Coin"
          $width={50}
        />
      )}
      <Container display="flex" direction="column" gap={8} width="full">
        <Typography variant="h5" $textAlign="center">
          <LangDisplay
            text={title}
            variables={{ dappName: connectionClientMeta?.name }}
          />
        </Typography>
        <Typography variant="span" color="muted">
          <LangDisplay text={connectionClientMeta?.url ?? ''} />
        </Typography>
      </Container>
    </Container>
  );
};

DappConnectionDisplay.defaultProps = {
  connected: false,
};
