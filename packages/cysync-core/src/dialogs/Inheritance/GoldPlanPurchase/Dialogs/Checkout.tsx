import { constants } from '@cypherock/cysync-core-constants';
import {
  Button,
  Container,
  LangDisplay,
  Payment,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

export const Checkout = () => {
  const [tempCoupon, setCoupon] = useState('');
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.checkout;
  const {
    onNext,
    applyCoupon,
    removeCoupon,
    isCouponApplied,
    isApplyingCoupon,
    coupon,
    applyingCouponError,
    couponDuration,
    isActivatingCoupon,
    activateCoupon,
    isCouponActivated,
  } = useInheritanceGoldPlanPurchaseDialog();

  const onApply = () => {
    applyCoupon(tempCoupon);
  };

  const onDelete = () => {
    setCoupon('');
    removeCoupon();
  };

  const couponText = isCouponApplied ? coupon : tempCoupon;

  useEffect(() => {
    if (isCouponActivated) {
      onNext();
    }
  }, [isCouponActivated, onNext]);

  return (
    <Layout
      footerComponent={
        <Button
          onClick={activateCoupon}
          disabled={!isCouponApplied || isActivatingCoupon}
          isLoading={isActivatingCoupon}
        >
          {lang.strings.buttons.checkout}
        </Button>
      }
    >
      <Container direction="column" gap={4}>
        <Typography $fontSize={20} color="white">
          <LangDisplay text={strings.payment.title} />
        </Typography>
        <Typography $fontSize={16} color="muted">
          <LangDisplay text={strings.payment.subtext} />
        </Typography>
      </Container>
      <Payment
        lang={lang.strings.inheritance.dialog.payment}
        externalLink={constants.inheritance.goldPlanPurchaseLink}
        isLoading={isApplyingCoupon}
        applied={isCouponApplied}
        error={applyingCouponError}
        coupon={couponText}
        onChange={setCoupon}
        onApply={onApply}
        onDelete={onDelete}
        year={couponDuration}
      />
    </Layout>
  );
};
