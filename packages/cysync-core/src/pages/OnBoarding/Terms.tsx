import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  Flex,
  Typography,
  Bullet,
  termsLinkImage,
  Image,
  DialogBoxFooter,
  Button,
  LangDisplay,
  CheckBox,
  LogoOutlinedAsideImage,
} from '@cypherock/cysync-ui';
import { Link } from 'react-router-dom';
import { routes } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from './OnboardingPageLayout';

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
}) => (
  <DialogBox width={500} height={454} direction="column">
    <DialogBoxHeader display="flex" justify="center" width="full">
      <Typography $textAlign="center" variant="h5" color="heading">
        <LangDisplay text={title} />
      </Typography>
    </DialogBoxHeader>
    <DialogBoxBody gap={16} direction="column" align="center">
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
              <LangDisplay text={bulletPoints.terms} />
            </Typography>
          </Flex>
          <Image src={termsLinkImage} width={12} height={12} alt="termsLink" />
        </Flex>
      </Container>
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
              <LangDisplay text={bulletPoints.privacyPolicy} />
            </Typography>
          </Flex>
          <Image src={termsLinkImage} width={12} height={12} alt="termsLink" />
        </Flex>
      </Container>
      <Flex align="center">
        <CheckBox
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <Typography fontSize={14} color="muted" $textAlign="left" ml={2}>
          <LangDisplay text={consent} />
        </Typography>
      </Flex>
    </DialogBoxBody>
    <DialogBoxFooter>
      {isChecked ? (
        <Link to={routes.onboarding.deviceAuthentication.path}>
          <Button variant="primary">
            {' '}
            <LangDisplay text={buttonText} />
          </Button>
        </Link>
      ) : (
        <Button variant="secondary" disabled>
          <LangDisplay text={buttonText} />
        </Button>
      )}
    </DialogBoxFooter>
  </DialogBox>
);

export const Terms: FC<{}> = () => {
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
