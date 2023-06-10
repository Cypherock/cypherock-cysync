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
    <Input width="full" type="password" />
  </Flex>
);

export const PasswordForm: React.FC<{
  passwordSetter: (val: boolean) => void;
}> = ({ passwordSetter }) => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Typography variant="h5" $textAlign="center" mb={2}>
          <LangDisplay text={lang.strings.onboarding.setPassword.title} /> (
          <Button variant="none" color="golden">
            <Typography variant="h5" color="gold">
              ?
            </Typography>
          </Button>
          )
        </Typography>
        <Flex direction="column" gap={16} width="full" mb={7}>
          <LabeledInput
            label={lang.strings.onboarding.setPassword.newPasswordLabel}
          />
          <LabeledInput
            label={lang.strings.onboarding.setPassword.confirmPasswordLabel}
          />
          <Container display="block" border="top" py={3}>
            <Typography
              variant="h6"
              color="error"
              font="light"
              $textAlign="left"
            >
              Password mismatch and other error messages
            </Typography>
          </Container>
        </Flex>
        <Container display="block" border="bottom" pb={2}>
          <Typography variant="fineprint" color="muted" $textAlign="center">
            {lang.strings.onboarding.setPassword.hint}
          </Typography>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          onClick={() => navigateTo(routes.onboarding.emailAuth.path)}
        >
          Skip
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            passwordSetter(true);
            navigateTo(routes.onboarding.emailAuth.path, 3000);
          }}
        >
          Confirm
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
