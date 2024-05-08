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

import { TransferFlowType } from '~/store';

import { TransferFlowProvider, useTransferFlow } from './context';
import { CloseConfirmation } from './Dialogs';

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

export const TransferFlowDialog: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    blastConfetti,
    showBackButton,
    title,
  } = useTransferFlow();
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

  const arrayVl = tabs.map(t => t.dialogs[0]);
  const title2 = getTitleFromReactElement(arrayVl[0]);
  if (
    title2 ===
    'I have lost my X1 vault but I still have all of the 4 old X1 cards'
  ) {
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
        {showOnClose && <CloseConfirmation setShowOnClose={setShowOnClose} />}
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

export const TransferFlow: FC<{ type: TransferFlowType }> = ({ type }) => (
  <TransferFlowProvider type={type}>
    <TransferFlowDialog />
  </TransferFlowProvider>
);
