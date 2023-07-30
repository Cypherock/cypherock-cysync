import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Tabs,
  Typography,
  TabContentContainer,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../../../context';
import { SingleTransaction } from './SingleTransaction';
import { BatchTransaction } from './BatchTransaction';
import { selectLanguage, useAppSelector } from '~/store';

export const BitcoinTransaction: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const bitcoin = lang.strings.send.bitcoin.info.dialogBox.transaction;

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const tabs = [
    {
      label: bitcoin.tabs.tab1,
      content: (
        <TabContentContainer>
          <SingleTransaction />
        </TabContentContainer>
      ),
    },
    {
      label: bitcoin.tabs.tab2,
      content: (
        <TabContentContainer>
          <BatchTransaction />
        </TabContentContainer>
      ),
    },
  ];

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={bitcoin.dialogBox.title} />
        </Typography>
        <Typography variant="span" $textAlign="center" color="muted">
          <LangDisplay text={bitcoin.dialogBox.text} />
        </Typography>
        <Tabs tabs={tabs} />
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
