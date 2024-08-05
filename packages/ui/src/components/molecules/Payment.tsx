import React, { FC, useState } from 'react';
import {
  Container,
  Divider,
  ExternalLink,
  Flex,
  Image,
  Typography,
} from '../atoms';

import { CouponInput } from './CouponInput';
import { useTheme } from '../../themes';
import { errorIcon, ShoppingCart } from '../../assets';

export interface PaymentProps {
  lang: {
    payment: {
      heading: string;
      form: {
        promoField: { label: string; placeholder: string };
      };
      noOfYear: string;
      total: string;
      year: string;
      couponInput: {
        applyButtonText: string;
        appliedButtonText: string;
      };
      error: {
        errorHeading: string;
        errorDescription: string;
      };
    };
  };

  applied: boolean;
  year: number;
  amount: string;
  error: boolean;
}

export const Payment: FC<PaymentProps> = ({
  lang,
  applied,
  year,
  amount,
  error,
}) => {
  const theme = useTheme();
  const [coupon, setCoupon] = useState('');

  const onApply = () => {
    // TODO: implement this function
  };

  const onDelete = () => {
    // TODO: implement this function
  };

  return (
    <Container display="flex" direction="column" width="720px" gap={8}>
      <ExternalLink
        text="Terms and Conditions"
        href="Some link"
        $flex={1}
        type={applied ? 'disabled' : 'golden'}
        icon={
          <ShoppingCart
            fill={applied ? theme.palette.text.disabled : 'black'}
            width={20}
            height={20}
          />
        }
      />
      <Flex
        direction="column"
        px={3}
        py={2}
        $flex={1}
        width="100%"
        $bgColor="separatorSecondary"
        $borderRadius={4}
        gap={16}
      >
        <Flex justify="space-between" align="center" $flex={1} width="100%">
          <Typography $fontSize={14}>
            {lang.payment.form.promoField.label}
          </Typography>
          <CouponInput
            isApplied={applied}
            isInvalid={error}
            value={coupon}
            onApply={onApply}
            onDelete={onDelete}
            onChange={setCoupon}
            appliedText={lang.payment.couponInput.appliedButtonText}
            applyButtonText={lang.payment.couponInput.applyButtonText}
            placeholderText={lang.payment.form.promoField.placeholder}
          />
        </Flex>
        {(() => {
          if (applied) {
            return (
              <Flex direction="column" gap={8}>
                <Flex justify="space-between">
                  <Typography $fontSize={12} color="muted">
                    {lang.payment.noOfYear}
                  </Typography>
                  <Typography
                    $fontSize={12}
                  >{`${year} ${lang.payment.year}`}</Typography>
                </Flex>
                <Divider
                  variant="horizontal"
                  background={theme.palette.border.separator}
                />
                <Flex justify="space-between">
                  <Typography $fontSize={12} $fontWeight="bold" color="muted">
                    {lang.payment.total}
                  </Typography>
                  <Typography $fontSize={12} $fontWeight="bold" color="muted">
                    {amount}
                  </Typography>
                </Flex>
              </Flex>
            );
          }
          if (error) {
            return (
              <Flex gap={16} direction="column">
                <Divider
                  variant="horizontal"
                  background={theme.palette.border.separator}
                />
                <Flex gap={16} align="center">
                  <Image src={errorIcon} $width={25} $height={20} alt="error" />
                  <Flex direction="column">
                    <Typography $fontSize={14}>
                      {lang.payment.error.errorHeading}
                    </Typography>
                    <Typography $fontSize={12} color="muted">
                      {lang.payment.error.errorDescription}
                    </Typography>
                  </Flex>
                </Flex>
              </Flex>
            );
          }
          return null;
        })()}
      </Flex>
    </Container>
  );
};
