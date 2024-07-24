import React, { useState } from 'react';
import styled from 'styled-components';

import { Delete } from '../../assets';
import { Flex, Typography } from '../atoms';
import { width, WidthProps } from '../utils';

const Container = styled.div`
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
  color: ${({ theme }) => theme.palette.text.muted};
  background: ${({ theme }) => theme.palette.background.slateDark};
  padding: 12px 16px;
  cursor: pointer;
  border: none;
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  border-color: transparent;
`;

export interface CouponProps extends WidthProps {
  initialState: {
    applied: boolean;
    code: string;
  };
}

export const Coupon: React.FC<CouponProps> = ({ initialState }) => {
  const [couponCode, setCouponCode] = useState(initialState.code);
  const [applied, setApplied] = useState(initialState.applied);

  const handleApply = () => {
    setApplied(true);
    if (!applied) {
      setCouponCode(couponCode);
    }
  };

  const handleDelete = () => {
    setCouponCode('');
    setApplied(false);
  };
  return (
    <Container>
      {!applied ? (
        <>
          <InputField
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={e => setCouponCode((e as any).target.value)}
            type="text"
            name="coupon"
          />
          <ApplyButton onClick={handleApply}>Apply</ApplyButton>
        </>
      ) : (
        <Flex
          $borderRadius={8}
          $borderWidth={1}
          width={364}
          justify="space-between"
          p="12px 16px"
          $fontSize={12}
          $fontFamily="normal"
          $borderColor="success"
        >
          <Typography
            color="muted"
            display="flex"
            gap={8}
            $fontFamily="normal"
            $fontSize={12}
          >
            Coupon applied:
            <Typography color="white" $fontWeight="semibold" $fontSize={12}>
              {couponCode}
            </Typography>
          </Typography>
          <Delete width="14.222px" cursor="pointer" onClick={handleDelete} />
        </Flex>
      )}
    </Container>
  );
};
