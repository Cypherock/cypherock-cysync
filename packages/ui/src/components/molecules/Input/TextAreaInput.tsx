import React, { FC, TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';

import { Container, Flex, LangDisplay, Tooltip, Typography } from '../../atoms';
import { UtilsProps, utils } from '../../utils';
import { InputLabel, InputLabelProps } from './InputLabel';
import { QuestionMarkButton } from '../Prefabs';

interface TextAreaInputProps
  extends UtilsProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onBlur'> {
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: (val: string) => void;
  disabled?: boolean;
  placeholder: string;
  maxChars?: number;
  currentChars?: number;
  label?: string;
  inputLabelProps?: InputLabelProps;
  tooltip?: string;
  rightLabel?: string;
  showRequiredStar?: boolean;
  trailing?: React.ReactNode;
}

const TextAreaInputStyle = styled.textarea`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.input};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  height: 182px;
  resize: none;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #8b8682;
  }
  ${utils}
`;

export const TextAreaInput: FC<TextAreaInputProps> = ({
  onChange,
  onBlur,
  maxChars,
  currentChars = 0,
  label,
  inputLabelProps,
  tooltip,
  rightLabel,
  showRequiredStar,
  trailing,
  ...props
}) => (
  <Flex
    direction="column"
    width={props.width ?? '100%'}
    gap={8}
    mb={props.mb ?? 2}
  >
    {label && (
      <InputLabel p={0} mb={0} {...(inputLabelProps ?? {})}>
        <Container $variant="span" align="center" justify="space-between">
          <Flex gap={4} align="center">
            <LangDisplay text={label} />
            {tooltip && (
              <Tooltip text={tooltip} tooltipPlacement="bottom">
                <QuestionMarkButton />
              </Tooltip>
            )}
          </Flex>
          <span>
            {rightLabel && <LangDisplay text={rightLabel} />}
            {showRequiredStar && (
              <Typography variant="span" color="error">
                {' '}
                *
              </Typography>
            )}
            {trailing}
          </span>
        </Container>
      </InputLabel>
    )}
    <TextAreaInputStyle
      {...props}
      onChange={e => onChange?.(e.target.value)}
      onBlur={e => onBlur?.(e.target.value)}
      maxLength={maxChars}
    />
    {maxChars && (
      <Flex width="100%" $flex={1} justify="flex-end">
        <Typography
          color="muted"
          $fontSize={8}
        >{`${currentChars}/${maxChars}`}</Typography>
      </Flex>
    )}
  </Flex>
);

TextAreaInput.defaultProps = {
  value: '',
  onChange: undefined,
  onBlur: undefined,
  disabled: false,
  maxChars: undefined,
  currentChars: 0,
  tooltip: undefined,
  rightLabel: undefined,
  showRequiredStar: undefined,
  label: undefined,
  inputLabelProps: undefined,
  trailing: undefined,
};
