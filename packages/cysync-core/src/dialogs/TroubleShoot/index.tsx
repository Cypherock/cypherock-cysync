import {
  DialogBox,
  DialogBoxBody,
  WalletDialogMainContainer,
  MilestoneAside,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { TroubleShootType } from '~/store';

import { GuidedFlowProvider, useTroubleShoot } from './context';

export const TroubleShootDialog: FC = () => {
  const { tabs, currentTab, currentDialog, title } = useTroubleShoot();
  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <>
          <MilestoneAside
            heading={title}
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
          />
          <WalletDialogMainContainer>
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
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const TroubleShoot: FC<{ type: TroubleShootType }> = ({ type }) => (
  <GuidedFlowProvider type={type}>
    <TroubleShootDialog />
  </GuidedFlowProvider>
);
