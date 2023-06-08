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
  align-self: flex-start;
  width: 372px;
  min-height: 80vh;
  height: 100%;
  padding: 48px 29px;
  background-image: ${({ theme }) => theme.palette.background.sideBar};
`;

export const Aside: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <AsideStyle>
      <Image width={32} src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
      <Flex direction="column" py={8}>
        <Flex gap={16}>
          <Flex height={60} align="flex-end">
            <Flex>
              <Container
                $bgColor="white"
                width={1}
                height={30.5}
                rounded="full"
              />
              <Container
                $bgColor="white"
                width={16}
                height={1}
                rounded="full"
              />
            </Flex>
          </Flex>
          <Flex align="center" justify="space-between" width="full">
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
        </Flex>
        <Flex gap={16}>
          <Flex height={60} align="flex-end">
            <Flex align="center">
              <Flex direction="column">
                <Container
                  $bgColor="muted"
                  width={1}
                  height={30.5}
                  rounded="full"
                />
                <Container
                  $bgColor="muted"
                  width={1}
                  height={30.5}
                  rounded="full"
                />
              </Flex>
              <Container
                $bgColor="muted"
                width={16}
                height={1}
                rounded="full"
              />
            </Flex>
          </Flex>
          <Flex align="center" justify="space-between" width="full">
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
        </Flex>
        <Flex gap={16}>
          <Flex height={60} align="flex-start">
            <Flex align="flex-end">
              <Container
                $bgColor="muted"
                width={1}
                height={30.5}
                rounded="full"
              />
              <Container
                $bgColor="muted"
                width={16}
                height={1}
                rounded="full"
              />
            </Flex>
          </Flex>
          <Flex align="center" justify="space-between" width="full">
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
      </Flex>
    </AsideStyle>
  );
};
