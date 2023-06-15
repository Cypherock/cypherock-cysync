import React, { FC, useState } from 'react';
import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  Typography,
  recoverWalletIcon,
} from '@cypherock/cysync-ui';
import { Header } from './Header';
import { CreateWalletDialogBox } from './CreateWalletDialogBox';
import { ImportWalletDialogBox } from './ImportWalletDialogBox';
import { TransferWallet } from './TransferWallet';
import { CreateNewWallet } from '../CreateNewWallet';

export const WalletActionsDialogBox: FC<{
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
  transferWallet: {
    title: string;
    subTitle: string;
    button: string;
  };
}> = ({ createWallet, transferWallet, importWallet, title, subTitle }) => {
  const [showCreateWalletDialogBox, setShowCreateWalletDialogBox] =
    useState<boolean>(false);
  return (
    <>
      {showCreateWalletDialogBox && (
        <CreateNewWallet
          setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
        />
      )}
      <DialogBox py={2} width="full">
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
            <CreateWalletDialogBox
              createWallet={createWallet}
              setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
            />
            <ImportWalletDialogBox importWallet={importWallet} />
            <DialogBox display={{ def: 'flex', lg: 'none' }} width="full">
              <DialogBoxBody height="full">
                <Image width={45} src={recoverWalletIcon} alt="recoverWallet" />
                <Flex gap={48} direction="column" height="full">
                  <Typography
                    $textAlign="center"
                    variant="h5"
                    color="heading"
                    mb={1}
                  >
                    <LangDisplay text={transferWallet.title} />
                  </Typography>
                </Flex>
              </DialogBoxBody>
              <DialogBoxFooter>
                <Button variant="primary">
                  <LangDisplay text={transferWallet.button} />
                </Button>
              </DialogBoxFooter>
            </DialogBox>
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          <TransferWallet transferWallet={transferWallet} />
        </DialogBoxFooter>
      </DialogBox>
    </>
  );
};
