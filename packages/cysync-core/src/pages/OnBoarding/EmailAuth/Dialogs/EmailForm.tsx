import {
  DialogBoxFooter,
  Input,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  Container,
  Image,
  emailIconOutlined,
} from '@cypherock/cysync-ui';
import React from 'react';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';

import { useAppSelector, selectLanguage } from '~/store';

const LabeledInput: React.FC<{ label: string }> = ({ label }) => (
  <Flex direction="column" width="full" align="flex-start" gap={8}>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label>
      <Typography
        variant="fineprint"
        color="muted"
        ml={1}
        $letterSpacing={0.12}
      >
        {label}
      </Typography>
    </label>
    <Input width="full" type="text" />
  </Flex>
);

export const EmailForm: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const toNextPage = () =>
    navigateTo(routes.onboarding.deviceAuthentication.path);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={emailIconOutlined} alt="Email Icon" />
        <Typography variant="h5" $textAlign="center" mb={2}>
          <LangDisplay text={lang.strings.onboarding.emailAuth.title} /> (
          <Button variant="none" color="golden">
            <Typography variant="h5" color="gold">
              ?
            </Typography>
          </Button>
          )
        </Typography>

        <Flex direction="column" gap={16} width="full">
          <LabeledInput
            label={lang.strings.onboarding.emailAuth.enterEmailLabel}
          />
          <Container display="block" border="top" py={3}>
            <Typography
              variant="h6"
              color="error"
              font="light"
              $textAlign="left"
            >
              Email related error messages
            </Typography>
          </Container>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={toNextPage}>
          Skip
        </Button>
        <Button variant="primary" onClick={toNextPage}>
          Confirm
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
