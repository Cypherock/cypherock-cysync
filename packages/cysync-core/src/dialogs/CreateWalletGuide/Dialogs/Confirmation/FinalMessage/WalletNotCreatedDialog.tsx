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

import { openWalletActionsDialog } from '~/actions';
import { useCreateWalletGuide } from '~/context/createWalletGuide';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { setCurrentTab: setTab, setCurrentDialog: setDialogBox } =
    useCreateWalletGuide();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <Typography color="gold">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.buttons.later
            }
          />
        </Typography>
      </Button>
      <Button
        onClick={() => {
          setTab(0);
          setDialogBox(0);
          dispatch(openWalletActionsDialog());
          dispatch(closeDialog('createWalletGuide'));
        }}
        variant="primary"
      >
        <Typography color="black">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.buttons.createWallet
            }
          />
        </Typography>
      </Button>
    </Flex>
  );
};

export const WalletNotCreatedDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateWalletGuide();
  return (
    <BlurOverlay>
      <DialogBox width={500}>
        <DialogBoxBody p="0" pt={2}>
          <GuidedFlowDialogBox
            image={redDisconnectedIcon}
            onNext={onNext}
            onPrevious={onPrevious}
            title={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.title
            }
            subTitle={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.subTitle
            }
            footer={<Buttons />}
          />
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
