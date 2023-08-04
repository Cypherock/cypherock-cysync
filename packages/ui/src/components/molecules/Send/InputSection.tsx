import SvgGoldQuestionMark from '../../../assets/icons/generated/GoldQuestionMark';
import {
  Container,
  Flex,
  Typography,
  Input,
  SliderCaption,
  LangDisplay,
} from '../../atoms';
import React from 'react';
import { InfoBox } from '../InfoBox';
import { Slider } from '../Slider';

interface InputSectionProps {
  activeButtonId: number;
  single: any;
  sliderValue: number;
  handleSliderChange: (newValue: number) => void;
  Captions: any;
  error: string;
  gas?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  activeButtonId,
  single,
  sliderValue,
  handleSliderChange,
  Captions,
  error,
  gas = false,
}) => (
  <>
    <Container display="flex" direction="column" gap={16} width="full">
      {/* <Flex justify="flex-end" align="center" width="full">
            {activeButtonId === 1 && <InfoBox text={single.message} />}
          </Flex> */}
      <Flex justify="space-between" align="center" width="full">
        {gas && (
          <Flex align="center" gap={8}>
            <Typography
              variant="span"
              width="100%"
              color="muted"
              $fontSize={13}
            >
              <LangDisplay text={single.gas} />
            </Typography>
            <SvgGoldQuestionMark height={14} width={14} />
          </Flex>
        )}
        {activeButtonId === 1 && (
          <Flex align="flex-end" direction="row" gap={8} ml="auto">
            <InfoBox text={single.message} />
          </Flex>
        )}
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
          {!error && (
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={error} />
            </Typography>
          )}
        </>
      )}
    </Container>
    {activeButtonId === 2 && gas && (
      <Container display="flex" direction="column" gap={8} width="full">
        <Flex justify="space-between" align="center" width="full">
          <Flex align="center" gap={8}>
            <Typography
              variant="span"
              width="100%"
              color="muted"
              $fontSize={13}
            >
              <LangDisplay text={single.limit} />
            </Typography>
            <SvgGoldQuestionMark height={14} width={14} />
          </Flex>
        </Flex>
        <Input type="text" name="address" $textColor="white" />
      </Container>
    )}
  </>
);

InputSection.defaultProps = {
  gas: false,
};
