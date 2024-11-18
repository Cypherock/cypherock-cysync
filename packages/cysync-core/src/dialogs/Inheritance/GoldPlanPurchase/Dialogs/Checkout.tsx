import {
  Button,
  Container,
  LangDisplay,
  Payment,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { constants } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

export const Checkout = () => {
  const [tempCoupon, setCoupon] = useState('');
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.checkout;
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [isPlanActivated, setIsPlanActivated] = useState(false);

  const {
    onNext,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    applyingCouponError,
    couponDuration,
    isActivatingCoupon,
    activateCoupon,
  } = useInheritanceGoldPlanPurchaseDialog();

  const onApply = async () => {
    const isValid = await applyCoupon(tempCoupon);
    setIsValidCoupon(isValid);
  };

  const onActivate = async () => {
    const isActivated = await activateCoupon();
    setIsPlanActivated(isActivated);
  };

  const onDelete = () => {
    setCoupon('');
    removeCoupon();
    setIsValidCoupon(false);
    setIsPlanActivated(false);
  };

  const couponText = tempCoupon;

  useEffect(() => {
    if (isPlanActivated) {
      onNext();
    }
  }, [isPlanActivated, onNext]);

  return (
    <Layout
      footerComponent={
        <Button
          onClick={onActivate}
          disabled={!isValidCoupon || isActivatingCoupon}
          isLoading={isActivatingCoupon}
        >
          {lang.strings.buttons.confirm}
        </Button>
      }
    >
      <Container direction="column" gap={4}>
        <Typography $fontSize={20} color="white">
          <LangDisplay text={strings.payment.title} />
        </Typography>
        <Typography $fontSize={16} color="muted" $textAlign="center">
          <LangDisplay text={strings.payment.subtext} />
        </Typography>
      </Container>
      <Payment
        lang={lang.strings.inheritance.dialog.payment}
        externalLink={constants.inheritance.goldPlanPurchaseLink}
        isLoading={isApplyingCoupon}
        applied={isValidCoupon}
        error={applyingCouponError}
        coupon={couponText}
        onChange={setCoupon}
        onApply={onApply}
        onDelete={onDelete}
        duration={couponDuration}
        couponLength={14}
        autoFocus
      />
    </Layout>
  );
};
