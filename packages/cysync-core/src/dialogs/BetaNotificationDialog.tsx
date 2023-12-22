import {
  BlurOverlay,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  Flex,
  LangDisplay,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import ReactPlayer from 'react-player/youtube';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '..';

export const BetaNotificationDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const onClose = () => dispatch(closeDialog('betaNotificationDialog'));

  const strings = lang.strings.dialogs.betaNotification;

  return (
    <BlurOverlay>
      <DialogBox width={800} onClose={onClose} $maxHeight="80vh">
        <DialogBoxHeader height={56} width="full" px={3}>
          <Flex
            position="relative"
            width="full"
            justify="center"
            align="center"
          >
            <CloseButton
              onClick={onClose}
              $alignSelf="end"
              position="absolute"
              top={0.5}
              $translateY={-0.5}
              right={0}
            />
          </Flex>
        </DialogBoxHeader>
        <DialogBoxBody
          gap={{
            def: 12,
            lg: 48,
          }}
          p="0"
          py={4}
          px={2}
        >
          <Flex align="center" direction="column">
            <Typography
              width={{
                def: 582,
                lg: 1141,
              }}
              $textAlign="center"
              $fontSize={{
                def: 20,
                lg: 24,
              }}
              variant="h4"
              color="heading"
              mb={1}
            >
              <LangDisplay text={strings.title} />
            </Typography>
            <Typography
              display={{
                def: 'none',
                lg: 'block',
              }}
              width={964}
              $textAlign="center"
              variant="h5"
              color="muted"
              mb={1}
            >
              <LangDisplay text={strings.title} />
            </Typography>
          </Flex>
          <ScrollableContainer>
            <Flex
              gap={{ def: 12, lg: 32 }}
              align="center"
              justify="center"
              width="inherit"
              direction="column"
            >
              <ReactPlayer url="https://www.youtube.com/embed/X7Kv4cGptcA" />
              <Typography $textAlign="center" variant="div">
                <Typography mb={1} $textAlign="center">
                  We have done a major overhaul to the CySync app. The new
                  CySync comes with all your favorite features and much more.
                  Download from{' '}
                  <a
                    href="https://cypherock.com/get-started"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography variant="span" color="gold">
                      https://cypherock.com/get-started
                    </Typography>
                  </a>
                </Typography>
                <strong>Important</strong>
                <ul>
                  <li>You won’t lose your funds</li>
                  <li>
                    After update, you will have to import your accounts again
                  </li>
                </ul>
              </Typography>
            </Flex>
          </ScrollableContainer>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
