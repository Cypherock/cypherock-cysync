import {
  Button,
  Container,
  cysyncLogoSmall,
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
import React, { FC } from 'react';

import { InheritancePageLayout } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

export const SetupPage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <InheritancePageLayout
      onActionButtonClick={() => {
        'Implement this function';
      }}
      actionButtonText={lang.strings.inheritance.buttons.syncFromEmail}
    >
      <Container $flex={1}>
        <Flex direction="column" gap={64}>
          <Flex gap={24}>
            <DialogBox width={500}>
              <DialogBoxBody>
                <Image src={cysyncLogoSmall} alt="Cysync Logo" />
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
                <Button>{lang.strings.buttons.setup}</Button>
              </DialogBoxFooter>
            </DialogBox>
            <DialogBox width={500}>
              <DialogBoxBody>
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
                <Button>{lang.strings.buttons.sync}</Button>
              </DialogBoxFooter>
            </DialogBox>
          </Flex>
          <DialogBox width="100%" $flex={1} pb={2}>
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
                <Button variant="secondary">
                  <LangDisplay text={lang.strings.buttons.learnMore} />
                </Button>
              </Flex>
            </DialogBoxBody>
          </DialogBox>
        </Flex>
      </Container>
    </InheritancePageLayout>
  );
};
