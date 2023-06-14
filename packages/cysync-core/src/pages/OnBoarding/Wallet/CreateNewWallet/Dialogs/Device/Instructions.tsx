import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTheme } from 'styled-components';
import {
  Container,
  Flex,
  Image,
  LangDisplay,
  Typography,
  arrowForward,
  followInfo,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

export const Instructions: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  const theme = useTheme();
  return (
    <CreateWalletDialogBoxLayout
      heading={lang.strings.onboarding.createWallet.followInfo.heading}
      title={lang.strings.onboarding.createWallet.followInfo.title}
      setState={setState}
      image={followInfo}
    >
      <Flex gap={8} px={5} direction="column">
        <Container
          $alignSelf="start"
          align="center"
          gap={17}
          width="full"
          justify="flex-start"
          rounded={8}
          $bgColor="input"
          border="input"
          p="12"
        >
          <Image src={arrowForward} alt="arrowForward" />
          <Typography variant="h6" color="muted">
            <LangDisplay
              text={
                lang.strings.onboarding.createWallet.followInfo.list.first.first
              }
            />
            <span
              style={{
                background: theme?.palette.golden,
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              <LangDisplay
                text={
                  lang.strings.onboarding.createWallet.followInfo.list.first
                    .second
                }
              />
            </span>
          </Typography>
        </Container>
        <Container
          $alignSelf="start"
          align="center"
          gap={17}
          width="full"
          justify="flex-start"
          rounded={8}
          $bgColor="input"
          border="input"
          p="12"
        >
          <Image src={arrowForward} alt="arrowForward" />
          <Typography variant="h6" color="muted">
            <LangDisplay
              text={
                lang.strings.onboarding.createWallet.followInfo.list.second
                  .first
              }
            />
            <span
              style={{
                background: theme?.palette.golden,
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              <LangDisplay
                text={
                  lang.strings.onboarding.createWallet.followInfo.list.second
                    .second
                }
              />
            </span>
            <LangDisplay
              text={
                lang.strings.onboarding.createWallet.followInfo.list.second
                  .third
              }
            />
            <span
              style={{
                background: theme?.palette.golden,
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              <LangDisplay
                text={
                  lang.strings.onboarding.createWallet.followInfo.list.second
                    .fourth
                }
              />
            </span>
            <LangDisplay
              text={
                lang.strings.onboarding.createWallet.followInfo.list.second
                  .fifth
              }
            />
          </Typography>
        </Container>
      </Flex>
    </CreateWalletDialogBoxLayout>
  );
};
