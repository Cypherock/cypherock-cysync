import {
  Button,
  CheckBox,
  Container,
  Flex,
  LangDisplay,
  Typography,
  ExternalLink,
} from '@cypherock/cysync-ui';
import React from 'react';

import { constants } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

export const Terms = () => {
  const [isChecked, setIsChecked] = React.useState(false);
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritance.termsOfService;

  const { onNext } = useInheritanceEstateRecoveryDialog();

  const toNextPage = async () => {
    if (isChecked) onNext();
  };

  return (
    <Layout
      footerComponent={
        <Button
          variant={isChecked ? 'primary' : 'secondary'}
          disabled={!isChecked}
          onClick={() => toNextPage()}
        >
          <LangDisplay text={lang.strings.buttons.next} />
        </Button>
      }
    >
      <Container display="flex" direction="column" gap={4}>
        <Typography $textAlign="center" variant="h5" color="heading">
          <LangDisplay text={strings.title} />
        </Typography>
      </Container>
      <Flex width="full" direction="column" gap={16}>
        <ExternalLink
          href={constants.termsOfUseLink}
          text={strings.termsOfService}
        />
        <ExternalLink
          href={constants.termsOfUseLink}
          text={strings.privacyPolicy}
        />
      </Flex>
      <CheckBox
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        id="privacy_policy_accepted"
        label={strings.checkBoxLabel}
      />
    </Layout>
  );
};
