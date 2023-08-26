import React, { FC } from 'react';
import { WalletConnectDialogProvider, useWalletConnectDialog } from './context';
import {
  BlurOverlay,
  CloseButton,
  DialogBoxBackgroundBar,
  DialogBoxBody,
  HelpButton,
  WalletDialogMainContainer,
} from '@cypherock/cysync-ui';
import { DialogBox } from '@cypherock/cysync-ui/src';
import { selectLanguage, useAppSelector } from '~/store';

const WalletConnect: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { currentDialog, tabs, currentTab, onClose } = useWalletConnectDialog();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <WalletDialogMainContainer>
          {/* {blastConfetti && <ConfettiBlast />} */}
          <DialogBoxBody
            p={0}
            grow={2}
            align="center"
            gap={110}
            direction="column"
            height="full"
          >
            <DialogBox width={500}>
              <DialogBoxBody p="0" gap={0}>
                {tabs[currentTab]?.dialogs[currentDialog]}
              </DialogBoxBody>
            </DialogBox>
          </DialogBoxBody>

          <DialogBoxBackgroundBar
            leftComponent={<HelpButton text={lang.strings.help} />}
            rightComponent={<CloseButton onClick={onClose} />}
            position="top"
            useLightPadding
          />
          {/* {showBackButton && (
              <DialogBoxBackgroundBar
                leftComponent={
                  <BackButton
                    text={lang.strings.back}
                    onClick={backToWalletActions}
                  />
                }
                position="bottom"
                useLightPadding
              />
            )} */}
        </WalletDialogMainContainer>
      </DialogBox>
    </BlurOverlay>
  );
};

export const WalletConnectDialog: FC = () => (
  <WalletConnectDialogProvider>
    <WalletConnect />
  </WalletConnectDialogProvider>
);
