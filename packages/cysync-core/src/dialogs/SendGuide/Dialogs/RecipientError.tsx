import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Tabs,
  ButtonGroup,
  Typography,
  Slider,
  SliderCaption,
  ButtonAttributes,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { styled } from 'styled-components';

import { addKeyboardEvents } from '~/hooks';

import { useSendGuide } from '../context';

const TabContentContainer = styled.div`
  min-height: 200px;
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
  /* align-items: center; */
  color: white;
`;
const captions = [
  { id: 1, name: 'Min' },
  { id: 2, name: 'Average' },
  { id: 3, name: 'Max' },
];

const buttons: ButtonAttributes[] = [
  { id: 1, label: 'Sandard' },
  { id: 2, label: 'Advanced' },
];

export const RecipientError: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);

  const handleButtonClick = (id: number) => {
    console.log('clicked ', id);
    setActiveButtonId(id);
  };

  const handleSliderChange = (newValue: number) => {
    console.log('slider value ', newValue);
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

  const tabs = [
    {
      label: 'Single Transaction',
      content: (
        <TabContentContainer>
          <Slider initialValue={sliderValue} onChange={handleSliderChange} />
          <SliderCaption captions={captions} />
          <ButtonGroup
            buttons={buttons}
            activeButtonId={activeButtonId}
            onButtonClick={handleButtonClick}
          />
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
