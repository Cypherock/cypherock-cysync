import React, { FC } from 'react';

import { CouponInput } from './CouponInput';

import { errorIcon, ShoppingCart } from '../../assets';
import { useTheme } from '../../themes';
import {
  Container,
  Divider,
  ExternalLink,
  Flex,
  Image,
  Typography,
} from '../atoms';

export interface PaymentProps {
  lang: {
    heading: string;
    form: {
      promoField: { label: string; placeholder: string };
    };
    noOfYear: string;
    year: string;
    couponInput: {
      applyButtonText: string;
      appliedButtonText: string;
    };
  };
  applied: boolean;
  externalLink: string;
  error?: {
    heading: string;
    subtext: string;
  };
  year?: number;
  onApply: () => void;
  onDelete: () => void;
  coupon: string;
  onChange: (coupon: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  couponLength?: number;
  duration?: string;
}

export const Payment: FC<PaymentProps> = ({
  lang,
  applied,
  year,
  error,
  onApply,
  onDelete,
  coupon,
  onChange,
  externalLink,
  disabled,
  isLoading,
  couponLength,
  duration,
}) => {
  const theme = useTheme();

  return (
    <Container display="flex" direction="column" width="720px" gap={8}>
      <ExternalLink
        text={lang.heading}
        href={externalLink}
        $flex={1}
        width="100%"
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
          <Typography $fontSize={14}>{lang.form.promoField.label}</Typography>
          <CouponInput
            isApplied={applied}
            isInvalid={Boolean(error)}
            value={coupon}
            onApply={onApply}
            onDelete={onDelete}
            onChange={onChange}
            appliedText={lang.couponInput.appliedButtonText}
            applyButtonText={lang.couponInput.applyButtonText}
            placeholderText={lang.form.promoField.placeholder}
            disabled={disabled}
            isLoading={isLoading}
            couponLength={couponLength}
          />
        </Flex>
        {applied && (
          <Flex justify="space-between">
            <Typography $fontSize={12} color="muted">
              {lang.noOfYear}
            </Typography>
            <Typography $fontSize={12}>
              {duration ?? `${year} ${lang.year}`}
            </Typography>
          </Flex>
        )}
        {error && (
          <Flex gap={16} direction="column">
            <Divider
              variant="horizontal"
              background={theme.palette.border.separator}
            />
            <Flex gap={16} align="center">
              <Image src={errorIcon} $width={25} $height={20} alt="error" />
              <Flex direction="column">
                <Typography $fontSize={14}>{error.heading}</Typography>
                <Flex $maxHeight={50} align="flex-start" $overflowY="auto">
                  <Typography $fontSize={12} color="muted">
                    {error.subtext}
                  </Typography>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

Payment.defaultProps = {
  year: undefined,
  disabled: false,
  isLoading: false,
  error: undefined,
  couponLength: 14,
  duration: undefined,
};
