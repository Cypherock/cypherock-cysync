import {
  Button,
  CheckBox,
  Flex,
  LangDisplay,
  Typography,
  ExternalLink,
} from '@cypherock/cysync-ui';
import React from 'react';

import { constants } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

export const Terms = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritance.termsOfService;

  const { onNext, isTermsAccepted, setIsTermsAccepted } =
    useInheritanceSilverPlanPurchaseDialog();

  const toNextPage = async () => {
    if (isTermsAccepted) onNext();
  };

  return (
    <Layout
      footerComponent={
        <Button
          variant={isTermsAccepted ? 'primary' : 'secondary'}
          disabled={!isTermsAccepted}
          onClick={() => toNextPage()}
        >
          <LangDisplay text={lang.strings.buttons.next} />
        </Button>
      }
    >
      <Typography $textAlign="center" variant="h5" color="heading">
        <LangDisplay text={strings.title} />
      </Typography>
      <Flex width="full" direction="column" gap={16}>
        <ExternalLink
          href={constants.inheritance.termsOfServiceLink}
          text={strings.termsOfService}
        />
        <ExternalLink
          href={constants.inheritance.privacyPolicyLink}
          text={strings.privacyPolicy}
        />
      </Flex>
      <CheckBox
        checked={isTermsAccepted}
        onChange={() => setIsTermsAccepted(!isTermsAccepted)}
        id="privacy_policy_accepted"
        label={strings.checkBoxLabel}
      />
    </Layout>
  );
};
