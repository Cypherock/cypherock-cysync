import React, { FC } from 'react';
import { styled } from 'styled-components';

import { cysyncLogoSmall, greenTick } from '../../../assets';
import {
  Bullet,
  Container,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '../../atoms';
import { ProgressLine } from '../ProgressLine';

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

const textColor = (activeTab: number, index: number) => {
  if (index > activeTab) return 'muted';
  if (index < activeTab) return 'gold';
  return undefined;
};

export const MilestoneAside: FC<{
  heading?: string;
  milestones: string[];
  activeTab: number;
}> = ({ milestones, activeTab, heading }) => (
  <AsideStyle>
    {heading ? (
      <Typography $fontSize={18}>{heading}</Typography>
    ) : (
      <Image $width={32} src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
    )}
    <Flex direction="column" py={8}>
      {milestones.map((milestone, index) => (
        <Flex key={`milestone-index-${index + 1}`} gap={16}>
          <ProgressLine
            index={index}
            activeTab={activeTab}
            length={milestones.length}
          />
          <Flex align="center" justify="space-between" width="full">
            <Flex align="center" gap={16}>
              <Container
                $bgColor="separator"
                $borderRadius="full"
                width={28}
                height={28}
              >
                <Typography color={textColor(activeTab, index)}>
                  {index + 1}
                </Typography>
              </Container>
              <Typography color={textColor(activeTab, index)}>
                <LangDisplay text={milestone} />
              </Typography>
            </Flex>
            {activeTab > index ? (
              <Image src={greenTick} alt="greenTick" />
            ) : (
              <Bullet size="sm" variant={textColor(activeTab, index)} />
            )}
          </Flex>
        </Flex>
      ))}
    </Flex>
  </AsideStyle>
);

MilestoneAside.defaultProps = {
  heading: undefined,
};
