import {
  Flex,
  GuidedFlowDialogBox,
  redDisconnectedIcon,
  Button,
  BlurOverlay,
  DialogBox,
  DialogBoxBody,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openWalletCreationDialog } from '~/actions';
import { useWalletActions } from '~/context/walletActions';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { setCurrentTab, setCurrentDialogBox } = useWalletActions();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <Typography color="gold">
          <LangDisplay
            text={
              lang.strings.walletActions.walletNotCreatedDialog.buttons.later
            }
          />
        </Typography>
      </Button>
      <Button
        onClick={() => {
          dispatch(openWalletCreationDialog());
          dispatch(closeDialog('createWalletGuide'));
          setCurrentTab(0);
          setCurrentDialogBox(0);
        }}
        variant="primary"
      >
        <Typography color="black">
          <LangDisplay
            text={
              lang.strings.walletActions.walletNotCreatedDialog.buttons
                .createWallet
            }
          />
        </Typography>
      </Button>
    </Flex>
  );
};

export const WalletNotCreatedDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <BlurOverlay>
      <DialogBox width={500}>
        <DialogBoxBody p="0" pt={2}>
          <GuidedFlowDialogBox
            image={redDisconnectedIcon}
            onNext={onNext}
            onPrevious={onPrevious}
            title={lang.strings.walletActions.walletNotCreatedDialog.title}
            subTitle={
              lang.strings.walletActions.walletNotCreatedDialog.subTitle
            }
            footer={<Buttons />}
          />
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
