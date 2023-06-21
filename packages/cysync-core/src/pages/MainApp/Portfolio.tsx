import { BlurOverlay, Container } from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';
import { CreateNewWallet, WalletActionsDialogBox } from '../OnBoarding';

export const Portfolio: FC<{}> = () => {
  const [showWalletActionsDialogBox, setShowWalletActionsDialogBox] =
    useState(true);
  const [showCreateWalletDialogBox, setShowCreateWalletDialogBox] =
    useState<boolean>(false);
  const [showOnClose, setShowOnClose] = useState<boolean>(false);

  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      {showWalletActionsDialogBox && (
        <BlurOverlay>
          <WalletActionsDialogBox
            setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
            setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
          />
        </BlurOverlay>
      )}

      {showCreateWalletDialogBox && (
        <BlurOverlay>
          <CreateNewWallet
            setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
            setShowOnClose={setShowOnClose}
            setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
            showOnClose={showOnClose}
          />
        </BlurOverlay>
      )}
    </Container>
  );
};
