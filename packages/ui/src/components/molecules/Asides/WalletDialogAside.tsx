import React, { FC } from 'react';
import { styled } from 'styled-components';
import {
  Bullet,
  Container,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '../../atoms';
import { cysyncLogoSmall } from '../../../assets';

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

const ProgressLine: FC<{ index: number; length: number }> = ({
  index,
  length,
}) => {
  if (index === 0)
    return (
      <Flex height={60} align="flex-end">
        <Flex>
          <Container $bgColor="white" width={1} height={30.5} rounded="full" />
          <Container $bgColor="white" width={16} height={1} rounded="full" />
        </Flex>
      </Flex>
    );

  if (index === length - 1)
    return (
      <Flex height={60} align="flex-start">
        <Flex align="flex-end">
          <Container $bgColor="muted" width={1} height={30.5} rounded="full" />
          <Container $bgColor="muted" width={16} height={1} rounded="full" />
        </Flex>
      </Flex>
    );

  return (
    <Flex height={60} align="flex-end">
      <Flex align="center">
        <Flex direction="column">
          <Container $bgColor="muted" width={1} height={30.5} rounded="full" />
          <Container $bgColor="muted" width={1} height={30.5} rounded="full" />
        </Flex>
        <Container $bgColor="muted" width={16} height={1} rounded="full" />
      </Flex>
    </Flex>
  );
};

export const WalletDialogAside: FC<{
  tabs: Array<string>;
}> = ({ tabs }) => (
  <AsideStyle>
    <Image width={32} src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
    <Flex direction="column" py={8}>
      {tabs.map((tab, index) => (
        <Flex key={`tab-index-${index + 1}`} gap={16}>
          <ProgressLine index={index} length={tabs.length} />
          <Flex align="center" justify="space-between" width="full">
            <Flex align="center" gap={16}>
              <Container
                $bgColor="separator"
                rounded="full"
                width={28}
                height={28}
              >
                <Typography>{index + 1}</Typography>
              </Container>
              <Typography>
                <LangDisplay text={tab} />
              </Typography>
            </Flex>
            <Bullet size="sm" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  </AsideStyle>
);
