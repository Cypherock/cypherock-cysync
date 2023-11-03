import {
  AlertBox,
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  LangDisplay,
  Typography,
  UserExpertGraphics,
  UserFirstTimeGraphics,
  cysyncLogoBig,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { OnboardingPageLayout } from './OnboardingPageLayout';

interface UsageCardProps {
  isNewUser: boolean;
  title: string;
  note: string;
}

const UsageCard: React.FC<UsageCardProps> = ({ isNewUser, title, note }) => {
  const lang = useAppSelector(selectLanguage);
  const { buttons } = lang.strings;

  const navigateTo = useNavigateTo();
  const [isLoading, setIsLoading] = useState(false);

  const toNextPage = async (isNewUserParam: boolean) => {
    setIsLoading(true);
    await keyValueStore.isNewUser.set(isNewUserParam);
    setIsLoading(false);
    navigateTo(routes.onboarding.terms.path);
  };

  return (
    <DialogBox p={0} width={500}>
      <DialogBoxBody p={0} gap={0}>
        <Flex py={4} px={5} gap={32} direction="column" align="center">
          {isNewUser ? (
            <UserFirstTimeGraphics height={150} />
          ) : (
            <UserExpertGraphics height={150} />
          )}
          <Typography
            variant="h5"
            $fontSize={20}
            $alignSelf="stretch"
            $textAlign="center"
          >
            <LangDisplay text={title} />
          </Typography>
        </Flex>
        <Flex pt={2} pb={4} px={5}>
          <AlertBox height="114px" subAlert={note} variant="messageTertiary" />
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="primary"
          disabled={isLoading}
          onClick={() => toNextPage(isNewUser)}
        >
          <LangDisplay text={buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

export const Usage: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { userExpert, userNew } = lang.strings.onboarding.usage;

  return (
    <OnboardingPageLayout
      img={cysyncLogoBig}
      text={lang.strings.onboarding.deviceDetection.heading}
      title={lang.strings.onboarding.info.aside.title}
      subTitle={lang.strings.onboarding.info.aside.subTitle}
      backTo={routes.onboarding.info.path}
      withHelp
      currentState={3}
      totalState={8}
    >
      <Flex gap={16}>
        <UsageCard title={userNew.title} note={userNew.note} isNewUser />
        <UsageCard
          title={userExpert.title}
          note={userExpert.note}
          isNewUser={false}
        />
      </Flex>
    </OnboardingPageLayout>
  );
};
