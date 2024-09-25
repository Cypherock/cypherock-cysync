import {
  Button,
  Container,
  cypherockCoverIcon,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  questionMarkEllipseIcon,
  syncIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { openInheritanceSyncPlansDialog } from '~/actions';
import { constants, routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from '../../Layout';

export const InheritanceSetup: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const dispatch = useDispatch();

  const toSetup = useCallback(() => {
    navigateTo(routes.inheritance.choosePlan.path);
  }, [navigateTo]);

  const openSyncPlans = useCallback(() => {
    dispatch(openInheritanceSyncPlansDialog());
  }, [dispatch]);

  const openLearnMore = useCallback(() => {
    window.open(
      constants.inheritance.learnMore,
      '_blank',
      'noopener,noreferrer',
    );
  }, []);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      <Container $flex={1}>
        <Flex
          direction="column"
          gap={32}
          width="100%"
          $flex={1}
          justify="center"
          align="center"
        >
          <Flex gap={24}>
            <DialogBox width={500} height={351}>
              <DialogBoxBody justify="flex-start" $flex={1}>
                <Image src={cypherockCoverIcon} alt="cypherock covery icon" />
                <Container direction="column">
                  <Typography $fontSize={20} color="white">
                    {lang.strings.inheritance.homePage.setup.setupCover.title}
                  </Typography>
                  <Typography $fontSize={16} color="muted" $textAlign="center">
                    {
                      lang.strings.inheritance.homePage.setup.setupCover
                        .subTitle
                    }
                  </Typography>
                </Container>
              </DialogBoxBody>
              <DialogBoxFooter>
                <Button onClick={toSetup}>{lang.strings.buttons.setup}</Button>
              </DialogBoxFooter>
            </DialogBox>
            <DialogBox width={500} height={351}>
              <DialogBoxBody justify="flex-start" $flex={1}>
                <Image src={syncIcon} alt="Sync Icon" />
                <Container direction="column">
                  <Typography $fontSize={20} color="white">
                    {lang.strings.inheritance.homePage.setup.syncFromMail.title}
                  </Typography>
                  <Typography $fontSize={16} color="muted" $textAlign="center">
                    {
                      lang.strings.inheritance.homePage.setup.syncFromMail
                        .subTitle
                    }
                  </Typography>
                </Container>
              </DialogBoxBody>
              <DialogBoxFooter>
                <Button onClick={openSyncPlans}>
                  {lang.strings.buttons.sync}
                </Button>
              </DialogBoxFooter>
            </DialogBox>
          </Flex>
          <DialogBox width="1024px" $flex={1} pb={2}>
            <DialogBoxBody>
              <Flex gap={32} $flex={1} width="100%" align="center">
                <Image
                  src={questionMarkEllipseIcon}
                  $width={48}
                  $height={48}
                  alt="question mark"
                />
                <Flex direction="column" $flex={1} width="100%">
                  <Typography $fontSize={20} color="white">
                    {lang.strings.inheritance.homePage.setup.learnMore.title}
                  </Typography>
                  <Typography $fontSize={16} color="muted">
                    {lang.strings.inheritance.homePage.setup.learnMore.subTitle}
                  </Typography>
                </Flex>
                <Button variant="secondary" onClick={openLearnMore}>
                  <LangDisplay text={lang.strings.buttons.learnMore} />
                </Button>
              </Flex>
            </DialogBoxBody>
          </DialogBox>
        </Flex>
      </Container>
    </MainAppLayout>
  );
};
