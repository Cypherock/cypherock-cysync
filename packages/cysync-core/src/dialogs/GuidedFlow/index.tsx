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

import { openWalletActionsDialog } from '~/actions';
import {
  closeDialog,
  GuidedFlowType,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { GuidedFlowProvider, useGuidedFlow } from './context';
import { CloseConfirmation } from './Dialogs';

export const GuidedFlowDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { tabs, currentTab, currentDialog, blastConfetti, showBackButton } =
    useGuidedFlow();
  const [showOnClose, setShowOnClose] = React.useState(false);

  const dispatch = useAppDispatch();
  const backToWalletActions = () => {
    dispatch(closeDialog('guidedFlow'));
    dispatch(openWalletActionsDialog());
  };
  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        {showOnClose && <CloseConfirmation setShowOnClose={setShowOnClose} />}
        <>
          <MilestoneAside
            heading={lang.strings.guidedFlows.createWallet.title}
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
              <DialogBox width={500}>
                <DialogBoxBody p="0" gap={0}>
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </DialogBoxBody>
              </DialogBox>
            </DialogBoxBody>

            <DialogBoxBackgroundBar
              leftComponent={<HelpButton text={lang.strings.help} />}
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

export const GuidedFlow: FC<{ type: GuidedFlowType }> = ({ type }) => (
  <GuidedFlowProvider type={type}>
    <GuidedFlowDialog />
  </GuidedFlowProvider>
);
