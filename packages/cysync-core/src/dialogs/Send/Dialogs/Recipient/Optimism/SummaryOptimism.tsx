import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  walletIcon,
  Button,
  QrCode,
  SummaryBox,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { useSendDialog } from '../../../context';

export const SummaryOptimism: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const summary = lang.strings.send.summary.optimism.dialogBox;
  const toDetailsArray = summary.toDetails.flatMap((toDetail, idx) => [
    {
      id: `toDetail-address-${toDetail.id}`,
      leftIcon: <QrCode width="11px" height="20px" />,
      leftText: summary.to,
      rightText: toDetail.address,
    },
    {
      id: `toDetail-amount-${toDetail.id}`,
      leftText: summary.amount,
      rightText: toDetail.amountEth,
      rightSubText: toDetail.amountUsd,
    },
    ...(idx !== summary.toDetails.length - 1
      ? [{ isDivider: true, id: `divider-toDetail-${toDetail.id}` }]
      : []),
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
              id: '1',
              leftText: summary.from,
              leftIcon: (
                <Image src={walletIcon} alt="From" width="15px" height="12px" />
              ),
              rightComponent: summary.fromDetails,
            },
            { isDivider: true, id: '2' },
            ...toDetailsArray,
            { isDivider: true, id: '3' },
            {
              id: '4',
              leftText: summary.network.text,
              rightText: summary.network.eth,
              rightSubText: summary.network.usd,
            },
            { isDivider: true, id: '5' },
            {
              id: '6',
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
