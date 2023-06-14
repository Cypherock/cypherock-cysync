import React, { FC, useEffect, useState } from 'react';
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

const ProgressLine: FC<{
  index: number;
  length: number;
  activeTab: number;
}> = ({ index, length, activeTab }) => {
  if (index === 0)
    return (
      <Flex height={60} align="flex-end">
        <Flex>
          <Container
            $bgColor={activeTab >= 1 ? 'white' : 'muted'}
            width={1}
            height={30.5}
            rounded="full"
          />
          <Container
            $bgColor={activeTab >= 1 ? 'white' : 'muted'}
            width={16}
            height={1}
            rounded="full"
          />
        </Flex>
      </Flex>
    );

  if (index === length - 1)
    return (
      <Flex height={60} align="flex-start">
        <Flex align="flex-end">
          <Container
            $bgColor={activeTab >= 2 ? 'white' : 'muted'}
            width={1}
            height={30.5}
            rounded="full"
          />
          <Container
            $bgColor={activeTab >= 2 ? 'white' : 'muted'}
            width={16}
            height={1}
            rounded="full"
          />
        </Flex>
      </Flex>
    );

  return (
    <Flex height={60} align="flex-end">
      <Flex align="center">
        <Flex direction="column">
          <Container
            $bgColor={activeTab >= 3 ? 'white' : 'muted'}
            width={1}
            height={30.5}
            rounded="full"
          />
          <Container
            $bgColor={activeTab >= 3 ? 'white' : 'muted'}
            width={1}
            height={30.5}
            rounded="full"
          />
        </Flex>
        <Container
          $bgColor={activeTab >= 3 ? 'white' : 'muted'}
          width={16}
          height={1}
          rounded="full"
        />
      </Flex>
    </Flex>
  );
};

export const WalletDialogAside: FC<{
  tabs: Array<string>;
  state: number;
}> = ({ tabs, state }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  useEffect(() => {
    if (state <= 5) setActiveTab(1);
    else if (state === 6) setActiveTab(2);
    else if (state > 6) setActiveTab(3);
  }, [state]);

  return (
    <AsideStyle>
      <Image width={32} src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
      <Flex direction="column" py={8}>
        {tabs.map((tab, index) => (
          <Flex key={`tab-index-${index + 1}`} gap={16}>
            <ProgressLine
              index={index}
              length={tabs.length}
              activeTab={activeTab}
            />
            <Flex align="center" justify="space-between" width="full">
              <Flex align="center" gap={16}>
                <Container
                  $bgColor="separator"
                  rounded="full"
                  width={28}
                  height={28}
                >
                  <Typography
                    color={index + 1 <= activeTab ? undefined : 'muted'}
                  >
                    {index + 1}
                  </Typography>
                </Container>
                <Typography
                  color={index + 1 <= activeTab ? undefined : 'muted'}
                >
                  <LangDisplay text={tab} />
                </Typography>
              </Flex>
              <Bullet
                size="sm"
                variant={index + 1 <= activeTab ? undefined : 'muted'}
              />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </AsideStyle>
  );
};
