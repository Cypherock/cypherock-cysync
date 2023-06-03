import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Flex,
  Image,
  usageIcon,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { routes } from '~/constants';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

const InfoDialogBox: FC<{
  title: string;
  listItems: Array<string>;
  buttonText: string;
  setCurrentScreen: Dispatch<SetStateAction<string>>;
}> = ({ title, listItems, buttonText, setCurrentScreen }) => (
  <DialogBox direction="column" align="center" width={700}>
    <DialogBoxBody direction="column" align="center">
      <Typography variant="h5" color="heading" $textAlign="center">
        <LangDisplay text={title} />
      </Typography>
      <Container $bgColor="list" direction="column">
        <ListContainer p={4} direction="column" width="full">
          {listItems.map((listItem, index) => (
            <ListItem key={`list-item-${index + 1}`} width="full">
              <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                <LangDisplay text={listItem} />
              </Typography>
            </ListItem>
          ))}
        </ListContainer>
      </Container>
    </DialogBoxBody>
    <DialogBoxFooter>
      <Button onClick={() => setCurrentScreen('usage')} variant="primary">
        <LangDisplay text={buttonText} />
      </Button>
    </DialogBoxFooter>
  </DialogBox>
);

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
}) => (
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
        <Link to="/terms">
          <Button variant="primary">
            <LangDisplay text={buttonText} />
          </Button>
        </Link>
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
        <Link to={routes.onboarding.terms.path}>
          <Button variant="primary">
            <LangDisplay text={buttonText} />
          </Button>
        </Link>
      </DialogBoxFooter>
    </DialogBox>
  </Flex>
);

export const Info: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [currentScreen, setCurrentScreen] = useState('information');

  return (
    <OnboardingPageLayout
      img={cysyncLogoBig}
      text={lang.strings.onboarding.deviceDetection.heading}
      title={lang.strings.onboarding.info.aside.title}
      subTitle={lang.strings.onboarding.info.aside.subTitle}
      currentState={3}
      totalState={8}
      withHelp
      withBack
    >
      {currentScreen === 'information' ? (
        <InfoDialogBox
          title={lang.strings.onboarding.info.dialogBox.title}
          listItems={lang.strings.onboarding.info.dialogBox.listItems}
          buttonText={lang.strings.buttons.continue}
          setCurrentScreen={setCurrentScreen}
        />
      ) : (
        <UsageDialogBox
          buttonText={lang.strings.buttons.continue}
          subTitleFirst={lang.strings.onboarding.usage.subTitleFirst}
          subTitleSecond={lang.strings.onboarding.usage.subTitleSecond}
          titleFirst={lang.strings.onboarding.usage.titleFirst}
          titleSecond={lang.strings.onboarding.usage.titleSecond}
        />
      )}
    </OnboardingPageLayout>
  );
};
