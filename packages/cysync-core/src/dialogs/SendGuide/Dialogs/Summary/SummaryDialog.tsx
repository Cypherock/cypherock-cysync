import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  etheriumBlueIcon,
  walletIcon,
  Button,
  qrCodeIcon,
  SummaryBox,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../../context';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const SummaryDialog: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const summary = lang.strings.send.summary.info.dialogBox;

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  return (
    <DialogBox width={600}>
      <DialogBoxBody>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text="Summary" />
        </Typography>

        <SummaryBox
          fromIcon={walletIcon}
          toIcon={qrCodeIcon}
          etheriumIcon={etheriumBlueIcon}
          fromText={summary.from}
          walletName={summary.walletName}
          ethereumAmount={summary.ethereum}
          toAddress={summary.toAddress}
          amountEth={summary.amountEth}
          amountUsd={summary.amountUsd}
          networkFeeEth={summary.networkFeeEth}
          networkFeeUsd={summary.networkFeeUsd}
          totalEth={summary.totalEth}
          totalUsd={summary.totalUsd}
        />
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text={button.back} />
        </Button>
        <Button variant="primary">
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
