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

import { openContactSupportDialog, openWalletActionsDialog } from '~/actions';
import {
  closeDialog,
  selectLanguage,
  TransferLessCardsFlowType,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { TransferLessCardsFlowProvider, useTransferFlow } from './context';
import { CloseConfirmation } from './Dialogs';

export const TransferFlowLessCardsDialog: FC = () => {
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
    dispatch(closeDialog('guidedFlow'));
    dispatch(openWalletActionsDialog());
  };
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
              <DialogBox width={900}>
                <DialogBoxBody p="0" gap={0}>
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </DialogBoxBody>
              </DialogBox>
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

export const TransferLessCardsFlow: FC<{ type: TransferLessCardsFlowType }> = ({
  type,
}) => (
  <TransferLessCardsFlowProvider type={type}>
    <TransferFlowLessCardsDialog />
  </TransferLessCardsFlowProvider>
);
