import React, { FC } from 'react';
import {
  Button,
  Flex,
  Image,
  LangDisplay,
  Typography,
  recoverWalletIcon,
} from '@cypherock/cysync-ui';

export const TransferWallet: FC<{
  footer: {
    title: string;
    subTitle: string;
    button: string;
  };
}> = ({ footer }) => (
  <Flex
    display={{
      def: 'none',
      lg: 'flex',
    }}
    align="center"
    gap={{ def: 16, lg: 32 }}
    px={{ def: '20', lg: '250' }}
  >
    <Image src={recoverWalletIcon} alt="recoverWallet" />
    <Flex direction="column">
      <Typography variant="h5" color="heading" mb={1}>
        <LangDisplay text={footer.title} />
      </Typography>
      <Typography variant="h5" color="muted" mb={1}>
        <LangDisplay text={footer.subTitle} />
      </Typography>
    </Flex>
    <Button variant="primary">
      <LangDisplay text={footer.button} />
    </Button>
  </Flex>
);
