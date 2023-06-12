import {
  appUpdate,
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Image,
  LangDisplay,
  LogoOutlinedAsideImage,
  Typography,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import React, { FC } from 'react';
import { useNavigateTo } from '~/hooks';
import { routes } from '~/constants';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

const AppUpdateDialogBox: FC<{
  title: string;
}> = ({ title }) => {
  const navigateTo = useNavigateTo();
  const handleClick = () => {
    navigateTo(routes.onboarding.appUpdating.path);
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={appUpdate} alt="Device not connected" />
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={title} />
          </Typography>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button onClick={handleClick} variant="primary">
          <LangDisplay text="Update" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
export const AppUpdate: FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.appUpdate.heading}
      currentState={3}
      totalState={8}
      withHelp
      withBack
    >
      <AppUpdateDialogBox title={lang.strings.onboarding.appUpdate.title} />
    </OnboardingPageLayout>
  );
};
