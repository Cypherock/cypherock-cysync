import {
  QuestionMarkButton,
  LabeledInput,
  DialogBoxFooter,
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
import React, { useState } from 'react';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';

import { useAppSelector, selectLanguage } from '~/store';
import { getDB, validateEmail } from '~/utils';

export const EmailForm: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);
  const [emailAddress, setEmailAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const tryStoringEmail = async () => {
    const validation = validateEmail(emailAddress, lang);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }
    const db = await getDB();
    await db.storage.setItem('email', emailAddress);
    toNextPage();
  };

  const removeEmail = async () => {
    // we want to remove email on skipping to make sure there is no previous data stored
    const db = await getDB();
    if (await db.storage.getItem('email')) await db.storage.removeItem('email');
    toNextPage();
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={emailIconOutlined} alt="Email Icon" />
        <Typography variant="h5" $textAlign="center" mb={2}>
          <LangDisplay text={lang.strings.onboarding.emailAuth.title} /> (
          <QuestionMarkButton />)
        </Typography>

        <Flex direction="column" gap={16} width="full">
          <LabeledInput
            label={lang.strings.onboarding.emailAuth.enterEmailLabel}
            type="text"
            value={emailAddress}
            onChange={(e: any) => setEmailAddress(e.target.value)}
          />

          {errorMessage && (
            <Container display="block" border="top" py={3}>
              <Typography
                variant="h6"
                color="error"
                font="light"
                $textAlign="left"
              >
                {errorMessage}
              </Typography>
            </Container>
          )}
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={removeEmail}>
          Skip
        </Button>
        <Button variant="primary" onClick={tryStoringEmail}>
          Confirm
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
