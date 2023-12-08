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
  TermsOfUseGraphics,
  Typography,
} from '@cypherock/cysync-ui';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { constants, routes } from '~/constants';
import { useLockscreen } from '~/context';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { OnboardingPageLayout } from './OnboardingPageLayout';

const ExternalLinkItem: React.FC<{
  text: string;
  href: string;
}> = ({ text, href }) => (
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
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Image
          src={openExternalLink}
          $width={12}
          $height={12}
          alt="termsLink"
        />
      </a>
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
}> = ({
  bulletPoints,
  consent,
  buttonText,
  isChecked,
  setIsChecked,
  title,
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
        <TermsOfUseGraphics width={45} />
        <Container display="flex" direction="column" gap={4}>
          <Typography $textAlign="center" variant="h5" color="heading">
            <LangDisplay text={title} />
          </Typography>
          <Typography variant="p" $textAlign="center" color="muted" mb={2}>
            <LangDisplay text={subtext} />
          </Typography>
        </Container>
        <Flex width="full" direction="column" gap={16}>
          <ExternalLinkItem
            href={constants.termsOfUseLink}
            text={bulletPoints.terms}
          />
          <ExternalLinkItem
            href={constants.privacyPolicyLink}
            text={bulletPoints.privacyPolicy}
          />
        </Flex>
        <CheckBox
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          id="terms_accepted"
          label={consent}
        />
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant={isChecked ? 'primary' : 'secondary'}
          disabled={!isChecked}
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

  const fetchTerms = async () => {
    setIsChecked(await keyValueStore.isTermsAccepted.get());
  };

  const updateTerms = async () => {
    await keyValueStore.isTermsAccepted.set(isChecked);
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
      />
    </OnboardingPageLayout>
  );
};
