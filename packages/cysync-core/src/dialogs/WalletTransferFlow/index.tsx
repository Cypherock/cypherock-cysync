import {
  DialogBox,
  DialogBoxBody,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
  DialogBoxBackgroundBar,
  ConfettiBlast,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import styled from 'styled-components';

import {
  WalletTransferFlowType,
  useAppSelector,
  selectLanguage,
} from '~/store';

import { WalletTransferFlowProvider, useWalletTransferFlow } from './context';

import { CloseConfirmation } from '../GuidedFlow/Dialogs';

const DialogBoxStyle = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-radius: 16px;
  /* overflow-y: scroll; */
  text-align: center;
  width: 400px;
`;

export const WalletTransferFlowDialog: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    blastConfetti,
    showBackButton,
    title,
  } = useWalletTransferFlow();
  const [showOnClose, setShowOnClose] = React.useState(false);

  const isFinalMessageShown =
    currentTab === tabs.length - 1 &&
    currentDialog === tabs[tabs.length - 1].dialogs.length - 1;

  const getTitleFromReactElement = (
    node: React.ReactNode,
  ): string | undefined => {
    if (React.isValidElement(node)) {
      return node.props.title;
    }
    return undefined;
  };

  let hasNoStart = false;
  const lang = useAppSelector(selectLanguage);
  const arrayVl = tabs.map(t => t.dialogs[0]);
  const title2 = getTitleFromReactElement(arrayVl[0]);
  const displayText = lang.strings.guidedFlows.walletTransfer;

  if (title2 === displayText.tabs[0].pages[0].title) {
    hasNoStart = true;
  }

  return (
    <BlurOverlay>
      <DialogBox
        direction="row"
        gap={0}
        width="full"
        onClose={() => setShowOnClose(true)}
      >
        {showOnClose && (
          <CloseConfirmation
            setShowOnClose={setShowOnClose}
            dialogText={{
              title: lang.strings.guidedFlows.walletTransfer.closeDialog.title,
              subtitle:
                lang.strings.guidedFlows.walletTransfer.closeDialog.subtitle,
              primaryButton:
                lang.strings.guidedFlows.walletTransfer.closeDialog.buttons
                  .primary,
              secondaryButton:
                lang.strings.guidedFlows.walletTransfer.closeDialog.buttons
                  .secondary,
              messageBoxList:
                lang.strings.guidedFlows.walletTransfer.closeDialog
                  .messageBoxList,
              pathText:
                lang.strings.guidedFlows.walletTransfer.closeDialog.pathText,
            }}
            closeDialogType="walletTransferFlow"
            isWalletTransfer
          />
        )}
        <>
          <MilestoneAside
            heading={title}
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
            isFinalMessageShown={isFinalMessageShown}
            hasNoStart={hasNoStart}
          />
          <WalletDialogMainContainer>
            {blastConfetti && <ConfettiBlast />}
            <DialogBoxBody
              p={0}
              grow={2}
              align="center"
              gap={110}
              direction="column"
              height="full"
            >
              {currentTab === 0 ? (
                <DialogBoxStyle>
                  <DialogBoxBody p="0" gap={0}>
                    {tabs[currentTab]?.dialogs[currentDialog]}
                  </DialogBoxBody>
                </DialogBoxStyle>
              ) : (
                <DialogBox width={500}>
                  <DialogBoxBody p="0" gap={0}>
                    {tabs[currentTab]?.dialogs[currentDialog]}
                  </DialogBoxBody>
                </DialogBox>
              )}
            </DialogBoxBody>
            <DialogBoxBackgroundBar
              rightComponent={
                <CloseButton onClick={() => setShowOnClose(true)} />
              }
              position="top"
              useLightPadding
            />
            {showBackButton && (
              <DialogBoxBackgroundBar position="bottom" useLightPadding />
            )}
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const WalletTransferFlow: FC<{ type: WalletTransferFlowType }> = ({
  type,
}) => (
  <WalletTransferFlowProvider type={type}>
    <WalletTransferFlowDialog />
  </WalletTransferFlowProvider>
);
