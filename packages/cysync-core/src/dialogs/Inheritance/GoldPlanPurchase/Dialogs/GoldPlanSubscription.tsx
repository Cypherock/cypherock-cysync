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

export const GoldPlanSubscription = () => {
  const [applied, setApplied] = useState(false);
  const [isError, setIsError] = useState(false);
  const [coupon, setCoupon] = useState('');
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.checkout;
  const { onNext } = useInheritanceGoldPlanPurchaseDialog();

  useEffect(() => {
    setApplied(false);
    setIsError(false);
  }, []);

  const onApply = () => {
    // TODO: Implement onApply at subscription
  };

  const onDelete = () => {
    // TODO: Implement onApply at subscription
  };

  return (
    <Layout
      footerComponent={
        <Button onClick={() => onNext()}>
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
        lang={lang.strings.inheritance}
        applied={applied}
        isError={isError}
        coupon={coupon}
        onChange={setCoupon}
        onApply={onApply}
        onDelete={onDelete}
      />
    </Layout>
  );
};
