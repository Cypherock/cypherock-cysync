import {
  QuestionMarkButton,
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
  Input,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';

import { useAppSelector, selectLanguage } from '~/store';
import { keyValueStore, validateEmail } from '~/utils';

export const EmailForm: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);
  const [emailAddress, setEmailAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchEmail = async () =>
    setEmailAddress((await keyValueStore.email.get()) ?? '');

  const tryStoringEmail: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    if (isLoading) return;

    event.preventDefault();
    setIsLoading(true);

    const validation = validateEmail(emailAddress, lang);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    await keyValueStore.email.set(emailAddress);
    setIsLoading(false);
    toNextPage();
  };

  const removeEmail = async () => {
    await keyValueStore.email.remove();
    toNextPage();
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <DialogBox width={500}>
      <form onSubmit={tryStoringEmail}>
        <DialogBoxBody>
          <Image src={emailIconOutlined} alt="Email Icon" />
          <Flex direction="column" gap={4}>
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={lang.strings.onboarding.emailAuth.title} /> (
              <QuestionMarkButton />)
            </Typography>
            <Typography variant="h6" $textAlign="center" mb={2} color="muted">
              <LangDisplay text={lang.strings.onboarding.emailAuth.subtitle} />{' '}
              (
              <QuestionMarkButton />)
            </Typography>
          </Flex>

          <Flex direction="column" gap={16} width="full">
            <Flex gap={8} direction="column">
              <Input
                type="text"
                name="email"
                label={lang.strings.onboarding.emailAuth.enterEmailLabel}
                value={emailAddress}
                onChange={setEmailAddress}
                placeholder={lang.strings.onboarding.emailAuth.placeholder}
              />
            </Flex>

            {errorMessage && (
              <Container display="block" border="top" py={3}>
                <Typography
                  variant="h6"
                  color="error"
                  $fontWeight="light"
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
            {lang.strings.buttons.skip}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Confirm'}
          </Button>
        </DialogBoxFooter>
      </form>
    </DialogBox>
  );
};
