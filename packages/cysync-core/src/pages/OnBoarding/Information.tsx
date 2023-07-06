import {
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  ListItem,
  ListContainer,
  Typography,
  cysyncLogoBig,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { OnboardingPageLayout } from './OnboardingPageLayout';

const InfoDialogBox: FC<{
  title: string;
  listItems: string[];
  buttonText: string;
}> = ({ title, listItems, buttonText }) => {
  const navigateTo = useNavigateTo();

  return (
    <DialogBox direction="column" align="center" width={700}>
      <DialogBoxBody direction="column" align="center" gap={48}>
        <Typography variant="h5" color="heading" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Container $bgColor="list" direction="column">
          <ListContainer
            py={2}
            pr={3}
            pl={6}
            direction="column"
            width="full"
            gap={16}
          >
            {listItems.map((listItem, index) => (
              <ListItem key={`list-item-${index + 1}`} width="full">
                <Typography
                  variant="h6"
                  color="muted"
                  $textAlign="left"
                  $letterSpacing={0.05}
                >
                  <LangDisplay text={listItem} />
                </Typography>
              </ListItem>
            ))}
          </ListContainer>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          onClick={() => {
            navigateTo(routes.onboarding.usage.path);
          }}
          variant="primary"
        >
          <LangDisplay text={buttonText} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

export const Information: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={cysyncLogoBig}
      text={lang.strings.onboarding.deviceDetection.heading}
      title={lang.strings.onboarding.info.aside.title}
      subTitle={lang.strings.onboarding.info.aside.subTitle}
    >
      <InfoDialogBox
        title={lang.strings.onboarding.info.dialogBox.title}
        listItems={lang.strings.onboarding.info.dialogBox.listItems}
        buttonText={lang.strings.buttons.continue}
      />
    </OnboardingPageLayout>
  );
};
