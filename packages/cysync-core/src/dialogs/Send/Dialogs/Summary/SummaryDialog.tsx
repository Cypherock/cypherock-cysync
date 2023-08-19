import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  walletIcon,
  Button,
  QrCode,
  Image,
  SummaryBox,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { useSendDialog } from '../../context';

export const SummaryDialog: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const summary = lang.strings.send.summary.info.dialogBox;
  const toDetailsArray = summary.toDetails.map(toDetail => [
    {
      leftIcon: <QrCode width="11px" height="20px" />,
      leftText: summary.to,
      rightText: toDetail.address,
      key: `toDetail-address-${toDetail.id}`,
    },
    {
      leftText: summary.amount,
      rightText: toDetail.amountEth,
      rightSubText: toDetail.amountUsd,
      key: `toDetail-amount-${toDetail.id}`,
    },
  ]);
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
          items={[
            {
              leftText: summary.from,
              leftIcon: (
                <Image src={walletIcon} alt="From" width="15px" height="12px" />
              ),
              rightComponent: summary.fromDetails,
            },
            { isDivider: true },
            ...toDetailsArray,
            { isDivider: true },
            {
              leftText: summary.network.text,
              rightText: summary.network.eth,
              rightSubText: summary.network.usd,
            },
            { isDivider: true },
            {
              leftText: summary.debit.text,
              rightText: summary.debit.eth,
              rightSubText: summary.debit.usd,
            },
          ]}
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
