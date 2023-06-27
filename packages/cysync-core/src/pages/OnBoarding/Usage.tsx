import React, { FC, useState } from 'react';
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
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
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
          <Image width={45} src={usageIcon} alt="usageIcon" />
          <Flex gap={16} direction="column" height="full">
            <Typography $alignSelf="center" variant="h5" color="heading" mb={1}>
              <LangDisplay text={titleFirst} />
            </Typography>
            <Container
              height="full"
              rounded={8}
              display={{ def: 'none', lg: 'block' }}
              $bgColor="input"
              px={2}
              py={3}
              align="flex-start"
            >
              <Typography variant="h6" color="muted">
                <LangDisplay text={subTitleFirst} />
              </Typography>
            </Container>
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant="primary"
            disabled={isNewUserButtonLoading}
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
          <Flex gap={16} height="full" direction="column">
            <Typography $textAlign="center" variant="h5" color="heading" mb={1}>
              <LangDisplay text={titleSecond} />
            </Typography>
            <Container
              height="full"
              rounded={8}
              $bgColor="input"
              align="flex-start"
              display={{ def: 'none', lg: 'block' }}
              px={2}
              py={3}
            >
              <Typography variant="h6" color="muted">
                <LangDisplay text={subTitleSecond} />
              </Typography>
            </Container>
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant="primary"
            disabled={isExistingUserButtonLoading}
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
