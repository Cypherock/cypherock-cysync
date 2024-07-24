import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

import { Check, CrossMark } from '../../assets';
import { colors } from '../../themes/color.styled';
import { Button, Flex, Typography } from '../atoms';
import { WidthProps, width } from '../utils';

type PlanType = 'silver' | 'gold';

interface PlanProps extends WidthProps {
  planType: PlanType;
  heading: string;
  tagline: string;
  description: string;
  price: string;
  features: { text: string; available: boolean }[];
}

const PlanContainer = styled.div<{ planType: PlanType }>`
  display: flex;
  width: 400px;
  padding: 40px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border-radius: 16px;
  background: ${({ planType, theme }) =>
    planType === 'silver'
      ? theme.palette.text.secondaryDark
      : colors.gradients.plan};
  box-shadow: 4px 4px 30px 0px #030303;
  border: ${({ planType }) => planType === 'gold' && '2px solid #FFD700'};
  ${width}
`;

export const Plan: FC<PlanProps> = ({
  planType,
  heading,
  tagline,
  description,
  price,
  features,
}): ReactElement => (
  <PlanContainer planType={planType}>
    <Flex direction="column" gap={0} $fontFamily="normal" align="flex-start">
      <Typography
        color={planType === 'silver' ? 'silver' : 'gold'}
        $fontSize={30}
        $fontWeight="bold"
      >
        {heading}
      </Typography>
      <Typography $fontWeight="normal" $fontSize={20} color="muted">
        {tagline}
      </Typography>
    </Flex>
    <Flex align="flex-start" gap={16} height={48}>
      <Typography
        color="white"
        $fontWeight="bold"
        $fontFamily="normal"
        $fontSize={40}
      >
        {price}
      </Typography>
      <Flex align="flex-end" gap={16} height={48}>
        <Typography
          $fontSize={16}
          $fontFamily="normal"
          $fontWeight="normal"
          color="normal"
        >
          /Wallet/Year
        </Typography>
      </Flex>
    </Flex>

    <Typography
      color="muted"
      $fontFamily="normal"
      $fontWeight="normal"
      $fontSize={16}
    >
      {description}
    </Typography>
    <Flex height={1} $bgColor="muted" $alignSelf="stretch" />
    <Flex direction="column" gap={32} justify="center">
      {features.map((feature, index) => (
        <Flex key={`${index + 1}`} align="center" gap={24}>
          {feature.available ? (
            <Check
              stroke="#00FF75"
              strokeWidth="3.5 px"
              height={13.333}
              width={18.667}
            />
          ) : (
            <CrossMark
              stroke="#FF0202"
              strokeWidth="3.5 px"
              height={13.333}
              width={18.667}
            />
          )}
          <Typography color="white">{feature.text}</Typography>
        </Flex>
      ))}
    </Flex>
    <Button
      variant={planType === 'silver' ? 'silver' : 'primary'}
      display="flex"
      $alignSelf="stretch"
      align="center"
      justify="center"
      $borderRadius="8px"
      $fontSize={16}
      $fontWeight="medium"
      $fontFamily="normal"
    >
      SELECT
    </Button>
  </PlanContainer>
);
