import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  Flex,
  Typography,
  Bullet,
  openExternalLink,
  Image,
  DialogBoxFooter,
  Button,
  LangDisplay,
  CheckBox,
  LogoOutlinedAsideImage,
} from '@cypherock/cysync-ui';
import { routes } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';
import { useNavigateTo } from '~/hooks';
import { OnboardingPageLayout } from './OnboardingPageLayout';

const ExternalLinkItem: React.FC<{
  text: string;
}> = ({ text }) => (
  <Container
    width="full"
    rounded={8}
    px={3}
    py="10"
    $bgColor="input"
    border="popup"
  >
    <Flex justify="space-between" align="center" width="full">
      <Flex align="center" gap={16}>
        <Bullet size="sm" />
        <Typography variant="h6" color="heading">
          <LangDisplay text={text} />
        </Typography>
      </Flex>
      <Button variant="none">
        <Image src={openExternalLink} width={12} height={12} alt="termsLink" />
      </Button>
    </Flex>
  </Container>
);

const TermsDialogBox: FC<{
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  title: string;
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
}) => {
  const navigateTo = useNavigateTo();
  const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);
  return (
    <DialogBox width={500} direction="column">
      <DialogBoxBody gap={32} direction="column" align="center">
        <Typography $textAlign="center" variant="h5" color="heading" mb={6}>
          <LangDisplay text={title} />
        </Typography>
        <Flex width="full" direction="column" gap={16}>
          <ExternalLinkItem text={bulletPoints.terms} />
          <ExternalLinkItem text={bulletPoints.privacyPolicy} />
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
          onClick={toNextPage}
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

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.terms.title}
      currentState={1}
      totalState={8}
      withHelp
      withBack
    >
      <TermsDialogBox
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        bulletPoints={lang.strings.onboarding.terms.bulletPoints}
        consent={lang.strings.onboarding.terms.consent}
        title={lang.strings.onboarding.terms.title}
        buttonText={lang.strings.buttons.confirm}
      />
    </OnboardingPageLayout>
  );
};
