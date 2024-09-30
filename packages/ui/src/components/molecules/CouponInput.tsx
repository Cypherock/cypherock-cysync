import React from 'react';
import styled, { useTheme } from 'styled-components';

import { DeleteIcon } from '../../assets';
import { Button, Flex, Throbber, Typography } from '../atoms';
import { goldenGradient, UtilsProps, width, WidthProps } from '../utils';

interface ApplyButtonProps
  extends UtilsProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  $isInvalid?: boolean;
}

const Container = styled.div<WidthProps>`
  display: flex;
  width: 320px;
  padding: 0px;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  ${width}
`;

const InputField = styled.input<{ $isInvalid: boolean }>`
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

  border: 1px solid ${({ theme, $isInvalid }) =>
    $isInvalid
      ? theme.palette.background.danger
      : theme.palette.border.separator};
  border-right: none;
`;

const ApplyButton = styled.button<ApplyButtonProps>`
  border-radius: 0px 8px 8px 0px;
  height: 45px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.text.disabled : theme.palette.text.black};
  ${props =>
    props.disabled
      ? `background: ${props.theme.palette.background.disabled};`
      : goldenGradient('background')}
  padding: 12px 16px;
  cursor: pointer;
  border: none;
  border: 1px solid
    ${({ theme, $isInvalid }) =>
      $isInvalid ? theme.palette.background.danger : 'transparent'};
  border-left: none;
`;

export interface CouponInputProps extends WidthProps {
  isApplied: boolean;
  isInvalid: boolean;
  value: string;
  onApply: () => void;
  onDelete: () => void;
  onChange: (value: string) => void;
  appliedText: string;
  applyButtonText: string;
  placeholderText: string;
  disabled?: boolean;
  isLoading?: boolean;
  couponLength?: number;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  isApplied,
  isInvalid,
  value,
  onApply,
  onDelete,
  onChange,
  appliedText,
  placeholderText,
  applyButtonText,
  disabled,
  isLoading,
  couponLength,
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
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={disabled || isLoading}
          onChange={event => onChange(event.target.value)}
          $isInvalid={isInvalid}
          maxLength={couponLength}
        />
        <ApplyButton
          onClick={onApply}
          $isInvalid={isInvalid}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={disabled || isLoading || value.length !== couponLength}
        >
          {isLoading ? <Throbber size={16} strokeWidth={2} /> : applyButtonText}
        </ApplyButton>
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

CouponInput.defaultProps = {
  disabled: false,
  isLoading: false,
  couponLength: undefined,
};
