// eslint-disable-next-line react/prop-types
import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  walletIcon,
  Button,
  qrCodeIcon,
  SummaryBox,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../context';

export const SummaryScrollDialog: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const summary = lang.strings.send.summary.scroll.dialogBox;

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
          <LangDisplay text={summary.title} />
        </Typography>

        <SummaryBox
          fromIcon={walletIcon}
          toIcon={qrCodeIcon}
          toText={summary.to}
          amountText={summary.amount}
          networkText={summary.network.text}
          debitText={summary.debit.text}
          fromText={summary.from}
          fromDetails={summary.fromDetails}
          toDetails={summary.toDetails}
          networkFeeEth={summary.network.eth}
          networkFeeUsd={summary.network.usd}
          totalDebitEth={summary.debit.eth}
          totalDebitUsd={summary.debit.usd}
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
