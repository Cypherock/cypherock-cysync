import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Tabs,
  Typography,
  TabContentContainer,
  Container,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { BatchTransaction } from './BatchTransaction';
import { SingleTransaction } from './SingleTransaction';

import { useSendDialog } from '../../../context';

export const BitcoinTransaction: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const bitcoin = lang.strings.send.bitcoin.info.dialogBox.transaction;

  const [btnState, handleButtonState] = useState(false);

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
          <SingleTransaction handleButtonState={handleButtonState} />
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
    <DialogBox width={517}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={4} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={bitcoin.dialogBox.title} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={bitcoin.dialogBox.text} />
          </Typography>
        </Container>
        <Tabs tabs={tabs} />
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text={button.back} />
        </Button>
        <Button variant="primary" disabled={!btnState}>
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
