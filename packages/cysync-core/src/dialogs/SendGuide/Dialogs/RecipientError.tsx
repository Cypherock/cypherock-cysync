import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Tabs,
  Slider,
  ButtonGroup,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { useSendGuide } from '../context';
import { addKeyboardEvents } from '~/hooks';
import { styled } from 'styled-components';

const TabContentContainer = styled.div`
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

export const RecipientError: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };
  const { onNext, onPrevious } = useSendGuide();

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const buttons = ['Standard', 'Advanced'];

  const tabs = [
    {
      label: 'Single Transaction',
      content: (
        <TabContentContainer>
          <Slider
            min={0}
            max={100}
            value={sliderValue}
            onChange={handleSliderChange}
          />

          <ButtonGroup buttons={buttons} />
        </TabContentContainer>
      ),
    },
    {
      label: 'Batch Transaction',
      content: (
        <TabContentContainer>Content of Batch Transaction</TabContentContainer>
      ),
    },
  ];

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text="Send crypto" />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text="Recipient" />
        </Typography>
        <Typography variant="span" $textAlign="center" color="muted">
          <LangDisplay text="Enter the amount and the address of the recipient to whom you want to send the funds" />
        </Typography>
        <Tabs tabs={tabs} />
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text="Back" />
        </Button>
        <Button variant="primary">
          <LangDisplay text="Continue" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
