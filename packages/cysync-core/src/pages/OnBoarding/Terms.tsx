import {
  Bullet,
  Button,
  CheckBox,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  LogoOutlinedAsideImage,
  openExternalLink,
  Typography,
} from '@cypherock/cysync-ui';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { routes } from '~/constants';
import { useLockscreen } from '~/context';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { OnboardingPageLayout } from './OnboardingPageLayout';

const ExternalLinkItem: React.FC<{
  text: string;
}> = ({ text }) => (
  <Container
    width="full"
    $borderRadius={8}
    px={3}
    py="10"
    $bgColor="input"
    $borderWidth={1}
  >
    <Flex justify="space-between" align="center" width="full">
      <Flex align="center" gap={16}>
        <Bullet size="sm" />
        <Typography variant="h6" color="heading">
          <LangDisplay text={text} />
        </Typography>
      </Flex>
      <Button variant="none">
        <Image
          src={openExternalLink}
          $width={12}
          $height={12}
          alt="termsLink"
        />
      </Button>
    </Flex>
  </Container>
);

const TermsDialogBox: FC<{
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  title: string;
  subtext: string;
  bulletPoints: {
    terms: string;
    privacyPolicy: string;
  };
  buttonText: string;
  consent: string;
  isLoading: boolean;
}> = ({
  bulletPoints,
  consent,
  buttonText,
  isChecked,
  setIsChecked,
  title,
  isLoading,
  subtext,
}) => {
  const { isPasswordSet } = useLockscreen();
  const navigateTo = useNavigateTo();
  const toNextPage = async () => {
    if (isPasswordSet) navigateTo(routes.onboarding.emailAuth.path);
    else navigateTo(routes.onboarding.setPassword.path);
  };
  return (
    <DialogBox width={500} direction="column">
      <DialogBoxBody gap={32} direction="column" align="center">
        <Container display="flex" direction="column" gap={4}>
          <Typography $textAlign="center" variant="h5" color="heading">
            <LangDisplay text={title} />
          </Typography>
          <Typography variant="p" $textAlign="center" color="muted" mb={2}>
            <LangDisplay text={subtext} />
          </Typography>
        </Container>
        <Flex width="full" direction="column" gap={16}>
          <ExternalLinkItem text={bulletPoints.terms} />
          <ExternalLinkItem text={bulletPoints.privacyPolicy} />
        </Flex>
        <CheckBox
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          isDisabled={isLoading}
          id="terms_accepted"
          label={consent}
        />
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant={isChecked ? 'primary' : 'secondary'}
          disabled={!isChecked}
          isLoading={isLoading}
          onClick={() => toNextPage()}
        >
          <LangDisplay text={buttonText} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

export const Terms: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTerms = async () => {
    setIsLoading(true);
    setIsChecked(await keyValueStore.isTermsAccepted.get());
    setIsLoading(false);
  };

  const updateTerms = async () => {
    setIsLoading(true);
    await keyValueStore.isTermsAccepted.set(isChecked);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    updateTerms();
  }, [isChecked]);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.terms.title}
      currentState={1}
      totalState={8}
      withHelp
      backTo={routes.onboarding.usage.path}
    >
      <TermsDialogBox
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        bulletPoints={lang.strings.onboarding.terms.bulletPoints}
        consent={lang.strings.onboarding.terms.consent}
        title={lang.strings.onboarding.terms.title}
        subtext={lang.strings.onboarding.terms.subtext}
        buttonText={lang.strings.buttons.confirm}
        isLoading={isLoading}
      />
    </OnboardingPageLayout>
  );
};
