import {
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Typography,
  cysyncLogoBig,
  DialogBoxFooter,
  Button,
  Flex,
  Image,
  usageIcon,
  InformationIcon,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { OnboardingPageLayout } from './OnboardingPageLayout';

const UsageDialogBox: FC<{
  titleFirst: string;
  titleSecond: string;
  subTitleFirst: string;
  subTitleSecond: string;
  buttonText: string;
}> = ({
  buttonText,
  subTitleFirst,
  subTitleSecond,
  titleFirst,
  titleSecond,
}) => {
  const navigateTo = useNavigateTo();
  const [isNewUserButtonLoading, setIsNewUserButtonLoading] = useState(false);
  const [isExistingUserButtonLoading, setIsExistingUserButtonLoading] =
    useState(false);
  const toNextPage = async (isNewUser: boolean) => {
    await keyValueStore.isNewUser.set(isNewUser);
    setIsExistingUserButtonLoading(false);
    setIsNewUserButtonLoading(false);
    navigateTo(routes.onboarding.terms.path);
  };

  return (
    <Flex
      gap={20}
      direction={{
        def: 'column',
        lg: 'row',
      }}
    >
      <DialogBox
        direction="column"
        width={{
          def: 458,
          lg: 500,
        }}
        height={{
          def: 276,
          lg: 483,
        }}
      >
        <DialogBoxBody
          grow={2}
          align="center"
          gap={{ def: 26, lg: 43.5 }}
          direction="column"
          height="full"
        >
          <Image $width={45} src={usageIcon} alt="usageIcon" />
          <Flex gap={48} direction="column" height="full" pb={4}>
            <Typography
              $alignSelf="center"
              variant="h5"
              color="heading"
              mb={1}
              $allowOverflow
            >
              <LangDisplay text={titleFirst} />
            </Typography>
            <Container
              height="full"
              $borderRadius={8}
              display={{ def: 'none', lg: 'flex' }}
              $bgColor="input"
              px={2}
              py={1}
              align="center"
              justify="center"
              gap={16}
            >
              <InformationIcon
                height={16}
                width={20}
                style={{ width: 20, height: 16 }}
              />
              <Container
                height="full"
                width="fit-content"
                display="flex"
                justify="center"
                align="center"
              >
                <Typography variant="h6" color="muted">
                  <LangDisplay text={subTitleFirst} />
                </Typography>
              </Container>
            </Container>
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant="primary"
            isLoading={isNewUserButtonLoading}
            onClick={() => {
              setIsNewUserButtonLoading(true);
              toNextPage(true);
            }}
          >
            <LangDisplay text={buttonText} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
      <DialogBox
        direction="column"
        width={{ def: 458, lg: 500 }}
        height={{ def: 276, lg: 483 }}
      >
        <DialogBoxBody
          align="center"
          direction="column"
          grow={1}
          gap={{ def: 26, lg: 43.5 }}
          justify="evenly"
          height="full"
        >
          <Image src={usageIcon} alt="usageIcon" />
          <Flex gap={48} height="full" direction="column" pb={4}>
            <Typography
              $alignSelf="center"
              variant="h5"
              color="heading"
              mb={1}
              $allowOverflow
            >
              <LangDisplay text={titleSecond} />
            </Typography>
            <Container
              height="full"
              $borderRadius={8}
              display={{ def: 'none', lg: 'flex' }}
              $bgColor="input"
              px={2}
              py={1}
              align="center"
              justify="center"
              gap={16}
            >
              <InformationIcon
                height={16}
                width={20}
                style={{ width: 20, height: 16 }}
              />
              <Container
                height="full"
                width="fit-content"
                display="flex"
                px={0}
                py={0}
                justify="flex-start"
                align="center"
              >
                <Typography variant="p" color="muted">
                  <LangDisplay text={subTitleSecond} />
                </Typography>
              </Container>
            </Container>
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant="primary"
            isLoading={isExistingUserButtonLoading}
            onClick={() => {
              setIsExistingUserButtonLoading(true);
              toNextPage(false);
            }}
          >
            <LangDisplay text={buttonText} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </Flex>
  );
};

export const Usage: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

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
      <UsageDialogBox
        buttonText={lang.strings.buttons.continue}
        subTitleFirst={lang.strings.onboarding.usage.subTitleFirst}
        subTitleSecond={lang.strings.onboarding.usage.subTitleSecond}
        titleFirst={lang.strings.onboarding.usage.titleFirst}
        titleSecond={lang.strings.onboarding.usage.titleSecond}
      />
    </OnboardingPageLayout>
  );
};
