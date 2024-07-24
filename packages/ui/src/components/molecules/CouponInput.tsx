import React from 'react';
import styled from 'styled-components';

import { DeleteIcon } from '../../assets';
import { Flex, Typography } from '../atoms';
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
  applied: boolean;
  couponCode: string;
  code: string;
  onApply: () => void;
  onDelete: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  couponText: string;
  buttonText: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  applied,
  couponCode,
  code,
  onApply,
  onDelete,
  onChange,
  couponText,
  buttonText,
  ...restProps
}) => (
  <Container {...restProps}>
    {!applied ? (
      <>
        <InputField
          placeholder="Enter coupon code"
          value={code}
          type="text"
          name="coupon"
          onChange={onChange}
        />
        <ApplyButton onClick={onApply}>{buttonText}</ApplyButton>
      </>
    ) : (
      <Flex
        $borderRadius={8}
        $borderWidth={1}
        width={320}
        height={45}
        justify="space-between"
        $fontSize={12}
        $fontFamily="normal"
        $borderColor="success"
      >
        <Flex gap={8} $fontFamily="normal" width={268} p="12px 16px">
          <Typography color="muted" $fontSize={12} $fontWeight="normal">
            {couponText}
          </Typography>
          <Typography color="white" $fontWeight="semibold" $fontSize={12}>
            {couponCode}
          </Typography>
        </Flex>
        <Flex
          width={52}
          justify="center"
          align="center"
          p="12px 16px"
          gap={16}
          $alignSelf="stretch"
        >
          <DeleteIcon
            width="20px"
            height="16px"
            cursor="pointer"
            onClick={onDelete}
          />
        </Flex>
      </Flex>
    )}
  </Container>
);
