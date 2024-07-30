import React from 'react';
import styled, { useTheme } from 'styled-components';

import { DeleteIcon } from '../../assets';
import { Button, Flex, Typography } from '../atoms';
import { width, WidthProps } from '../utils';

const Container = styled.div<WidthProps>`
  display: flex;
  width: 320px;
  padding: 0px;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  ${width}
`;

const InputField = styled.input`
  display: flex;
  padding: 12px 16px;
  font-size: 14px;
  align-items: center;
  height:45px;
  gap: 16px
  border-color: transparent;
  flex: 1 0 0;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  color: ${({ theme }) => theme.palette.text.white};

  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }
  border-radius: 8px 0px 0px 8px;

  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  border-right: none;
`;

const ApplyButton = styled.button`
  border-radius: 0px 8px 8px 0px;
  height: 45px;
  color: ${({ theme }) => theme.palette.text.muted};
  background: ${({ theme }) => theme.palette.background.slateDark};
  padding: 12px 16px;
  cursor: pointer;
  border: none;
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  border-color: transparent;
`;

export interface CouponInputProps extends WidthProps {
  isApplied: boolean;
  value: string;
  onApply: () => void;
  onDelete: () => void;
  onChange: (value: string) => void;
  appliedText: string;
  applyButtonText: string;
  placeholderText: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  isApplied,
  value,
  onApply,
  onDelete,
  onChange,
  appliedText,
  placeholderText,
  applyButtonText,
  ...restProps
}) => (
  <Container {...restProps}>
    {!isApplied ? (
      <>
        <InputField
          placeholder={placeholderText}
          value={value}
          type="text"
          name="coupon"
          onChange={event => onChange(event.target.value)}
        />
        <ApplyButton onClick={onApply}>{applyButtonText}</ApplyButton>
      </>
    ) : (
      <Flex
        width="full"
        $borderRadius={8}
        $borderWidth={1}
        height={45}
        justify="space-between"
        $fontSize={12}
        $fontFamily="normal"
        $borderColor="success"
        $bgColor="separatorSecondary"
      >
        <Flex gap={8} $fontFamily="normal" p="12px 16px">
          <Typography color="muted" $fontSize={12} $fontWeight="normal">
            {appliedText}
          </Typography>
          <Typography color="white" $fontWeight="semibold" $fontSize={12}>
            {value}
          </Typography>
        </Flex>
        <Flex
          justify="center"
          align="center"
          p="12px 16px"
          gap={16}
          $alignSelf="stretch"
        >
          <Button
            icon={<DeleteIcon color={useTheme()?.palette.text.muted} />}
            width="20px"
            variant="none"
            onClick={onDelete}
          />
        </Flex>
      </Flex>
    )}
  </Container>
);
