import React, { FC } from 'react';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import { useTheme } from 'styled-components';
import { Header } from './Header';
import { CreateWalletDialogBox } from './CreateWalletDialogBox';
import { ImportWalletDialogBox } from './ImportWalletDialogBox';
import { TransferWallet } from './TransferWallet';

export const WalletActionsDialogBox: FC<{
  help: string;
  title: string;
  subTitle: string;
  createWallet: {
    title: string;
    button: string;
    list: Array<string>;
  };
  importWallet: {
    title: string;
    button: string;
    list: Array<string>;
  };
  footer: {
    title: string;
    subTitle: string;
    button: string;
  };
}> = ({ createWallet, footer, help, importWallet, title, subTitle }) => {
  const theme = useTheme();
  return (
    <DialogBox width="full">
      <Container width="full" p={2} justify="flex-start">
        <Button variant="none">
          <Typography color="muted" fontSize={14}>
            <LangDisplay text={help} />
            <span
              style={{
                background: theme?.palette.golden,
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              ?
            </span>
          </Typography>
        </Button>
      </Container>
      <DialogBoxBody
        p="20"
        grow={2}
        align="center"
        gap={40}
        direction="column"
        height="full"
      >
        <Header subTitle={subTitle} title={title} />
        <Flex gap={20} px={{ def: '20', lg: '150' }}>
          <CreateWalletDialogBox createWallet={createWallet} />
          <ImportWalletDialogBox importWallet={importWallet} />
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <TransferWallet footer={footer} />
      </DialogBoxFooter>
    </DialogBox>
  );
};
