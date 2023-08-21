import {
  Container,
  Flex,
  Typography,
  Input,
  LangDisplay,
  Tag,
  GoldQuestionMark,
  Caption,
  FeesSlider,
  FeesInput,
} from '@cypherock/cysync-ui';
import React from 'react';

interface EthereumInputProps {
  type: 'slider' | 'input';
  message: string;
  inputValue: string;
  inputPostfix: string;
  gas?: string;
  limit?: string;
  value: number;
  onChange: (newValue: number) => void;
  captions: Caption[];
  error: string;
}

export const EthereumInput: React.FC<EthereumInputProps> = ({
  type,
  message,
  inputValue,
  inputPostfix,
  gas = '',
  limit = '',
  value,
  onChange,
  captions,
  error,
}) => (
  <>
    <Container display="flex" direction="column" gap={16} width="full">
      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            <LangDisplay text={gas} />
          </Typography>
          <GoldQuestionMark height={14} width={14} />
        </Flex>

        {type === 'slider' && (
          <Flex align="flex-end" direction="row" gap={8} ml="auto">
            <Tag type="info">
              {value}
              {message}
            </Tag>
          </Flex>
        )}
      </Flex>

      {type === 'slider' && (
        <FeesSlider
          value={value}
          onChange={onChange}
          captions={captions}
          error={error}
        />
      )}
    </Container>
    {type === 'input' && (
      <>
        <FeesInput value={inputValue} postfixText={inputPostfix} />

        <Container display="flex" direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={13}
              >
                <LangDisplay text={limit} />
              </Typography>
              <GoldQuestionMark height={14} width={14} />
            </Flex>
          </Flex>
          <Input type="number" name="address" $textColor="white" />
        </Container>
      </>
    )}
  </>
);

EthereumInput.defaultProps = {
  gas: '',
  limit: '',
};
