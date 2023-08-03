import {
  Container,
  Flex,
  Typography,
  InfoBox,
  Input,
  Slider,
  SliderCaption,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

interface InputSectionProps {
  activeButtonId: number;
  single: any; // Make sure to replace 'any' with the actual type of 'single'.
  sliderValue: number;
  handleSliderChange: (newValue: number) => void;
  Captions: any; // Make sure to replace 'any' with the actual type of 'Captions'.
}

const InputSection: React.FC<InputSectionProps> = ({
  activeButtonId,
  single,
  sliderValue,
  handleSliderChange,
  Captions,
}) => (
  <Container display="flex" direction="column" gap={16} width="full">
    <Flex justify="flex-end" align="center" width="full">
      {activeButtonId === 1 && <InfoBox text={single.message} />}
    </Flex>

    {activeButtonId === 2 && (
      <Input
        type="text"
        name="address"
        value={single.fee}
        $textColor="white"
        postfixText={single.inputPostfix}
      />
    )}

    {activeButtonId === 1 && (
      <>
        <Slider initialValue={sliderValue} onChange={handleSliderChange} />
        <SliderCaption captions={Captions} />
        <Typography
          variant="span"
          width="100%"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          <LangDisplay text={single.fees.error} />
        </Typography>
      </>
    )}
  </Container>
);

export default InputSection;
