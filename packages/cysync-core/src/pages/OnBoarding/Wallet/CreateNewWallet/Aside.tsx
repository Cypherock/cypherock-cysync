import {
  Container,
  Flex,
  Image,
  LangDisplay,
  Typography,
  Bullet,
  cysyncLogoSmall,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { styled } from 'styled-components';
import { selectLanguage, useAppSelector } from '~/store';

const AsideStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 372px;
  height: 80vh;
  padding: 48px 29px;
  background-image: ${({ theme }) => theme.palette.background.sideBar};
`;

export const Aside: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <AsideStyle>
      <Image width={32} src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
      <Flex direction="column" py={8}>
        <Flex align="center" py="18" justify="space-between">
          <Flex align="center" gap={16}>
            <Container
              $bgColor="separator"
              rounded="full"
              width={28}
              height={28}
            >
              <Typography>1</Typography>
            </Container>
            <Typography>
              <LangDisplay
                text={lang.strings.onboarding.createWallet.aside.tabs.device}
              />
            </Typography>
          </Flex>
          <Bullet size="sm" />
        </Flex>
        <Flex align="center" py="18" justify="space-between">
          <Flex align="center" gap={16}>
            <Container
              $bgColor="separator"
              rounded="full"
              width={28}
              height={28}
            >
              <Typography color="muted">2</Typography>
            </Container>
            <Typography color="muted">
              <LangDisplay
                text={
                  lang.strings.onboarding.createWallet.aside.tabs.syncX1Cards
                }
              />
            </Typography>
          </Flex>
          <Bullet size="sm" variant="muted" />
        </Flex>
        <Flex align="center" py="18" justify="space-between">
          <Flex align="center" gap={16}>
            <Container
              $bgColor="separator"
              rounded="full"
              width={28}
              height={28}
            >
              <Typography color="muted">3</Typography>
            </Container>
            <Typography color="muted">
              <LangDisplay
                text={
                  lang.strings.onboarding.createWallet.aside.tabs.confirmation
                }
              />
            </Typography>
          </Flex>
          <Bullet size="sm" variant="muted" />
        </Flex>
      </Flex>
    </AsideStyle>
  );
};
