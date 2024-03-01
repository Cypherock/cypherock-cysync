import {
  DialogBox,
  DialogBoxBody,
  HelpButton,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
  DialogBoxBackgroundBar,
  BackButton,
  ConfettiBlast,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import styled from 'styled-components';

import { openContactSupportDialog, openWalletActionsDialog } from '~/actions';
import {
  closeDialog,
  selectLanguage,
  TransferFlowType,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { TransferFlowProvider, useTransferFlow } from './context';
import { CloseConfirmation } from './Dialogs';

export const TransferFlowDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    tabs,
    currentTab,
    currentDialog,
    blastConfetti,
    showBackButton,
    title,
  } = useTransferFlow();
  const [showOnClose, setShowOnClose] = React.useState(false);

  const dispatch = useAppDispatch();
  const backToWalletActions = () => {
    dispatch(closeDialog('transferFlow'));
    dispatch(openWalletActionsDialog());
  };

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

  return (
    <BlurOverlay>
      <DialogBox
        direction="row"
        gap={0}
        width="full"
        onClose={() => setShowOnClose(true)}
      >
        {showOnClose && <CloseConfirmation setShowOnClose={setShowOnClose} />}
        <>
          <MilestoneAside
            heading={title}
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
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
              leftComponent={
                <HelpButton
                  text={lang.strings.help}
                  onClick={() => dispatch(openContactSupportDialog())}
                />
              }
              rightComponent={
                <CloseButton onClick={() => setShowOnClose(true)} />
              }
              position="top"
              useLightPadding
            />
            {showBackButton && (
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
            )}
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const TransferFlow: FC<{ type: TransferFlowType }> = ({ type }) => (
  <TransferFlowProvider type={type}>
    <TransferFlowDialog />
  </TransferFlowProvider>
);
