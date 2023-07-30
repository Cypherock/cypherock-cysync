// eslint-disable-next-line react/prop-types
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
  SummaryScrollBox,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../../context';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const SummaryScrollDialog: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();
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
          <LangDisplay text="Summary" />
        </Typography>

        <SummaryScrollBox
          walletIconSrc={walletIcon}
          ethereumIconSrc={etheriumBlueIcon}
          qrCodeIconSrc={qrCodeIcon}
          cypherockRedText={summary.text}
          ethereumText={summary.ethereumText}
          fromText={summary.from}
          toAddress={summary.toAddress}
          amountEth={summary.amountEth}
          amountInDollar={summary.amountInDollar}
          networkFeeEth={summary.networkFeeEth}
          networkFeeInDollar={summary.networkFeeInDollar}
          totalDebitEth={summary.totalDebitEth}
          totalDebitInDollar={summary.totalDebitInDollar}
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
