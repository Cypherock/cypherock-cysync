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
import { cysyncLogoSmall, greenTick } from '../../../assets';

const AsideStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: 372px;
  min-height: 80vh;
  height: 100%;
  padding: 48px 29px;
  border-radius: 16px 0 0 16px;
  background-image: ${({ theme }) => theme.palette.background.sideBar};
`;

const bgColor = (activeTab: number, index: number) => {
  if (index > activeTab) return 'muted';
  if (index < activeTab) return 'golden';
  return 'white';
};

const textColor = (activeTab: number, index: number) => {
  if (index > activeTab) return 'muted';
  if (index < activeTab) return 'gold';
  return undefined;
};

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
            $bgColor={bgColor(activeTab, 1)}
            width={1}
            height={30.5}
            $borderRadius="full"
          />
          <Container
            $bgColor={bgColor(activeTab, 1)}
            width={16}
            height={1}
            $borderRadius="full"
          />
        </Flex>
      </Flex>
    );

  if (index === length - 1)
    return (
      <Flex height={60} align="flex-start">
        <Flex align="flex-end">
          <Container
            $bgColor={bgColor(activeTab, 3)}
            width={1}
            height={30.5}
            $borderRadius="full"
          />
          <Container
            $bgColor={bgColor(activeTab, 3)}
            width={16}
            height={1}
            $borderRadius="full"
          />
        </Flex>
      </Flex>
    );

  return (
    <Flex height={60} align="flex-end">
      <Flex align="center">
        <Flex direction="column">
          <Container
            $bgColor={bgColor(activeTab, 2)}
            width={1}
            height={30.5}
            $borderRadius="full"
          />
          <Container
            $bgColor={bgColor(activeTab, 2)}
            width={1}
            height={30.5}
            $borderRadius="full"
          />
        </Flex>
        <Container
          $bgColor={bgColor(activeTab, 2)}
          width={16}
          height={1}
          $borderRadius="full"
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
                  $borderRadius="full"
                  width={28}
                  height={28}
                >
                  <Typography color={textColor(activeTab, index + 1)}>
                    {index + 1}
                  </Typography>
                </Container>
                <Typography color={textColor(activeTab, index + 1)}>
                  <LangDisplay text={tab} />
                </Typography>
              </Flex>
              {index + 1 < activeTab ? (
                <Image src={greenTick} alt="greenTick" />
              ) : (
                <Bullet size="sm" variant={textColor(activeTab, index + 1)} />
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </AsideStyle>
  );
};
