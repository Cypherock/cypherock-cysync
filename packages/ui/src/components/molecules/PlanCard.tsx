import React from 'react';
import styled from 'styled-components';

import { Check, CrossIcon } from '../../assets';
import { useTheme } from '../../themes';
import { Button, Flex, Typography } from '../atoms';
import { WidthProps, width } from '../utils';

export type PlanCardType = 'silver' | 'gold';

export interface PlanCardProps extends WidthProps {
  plantype: PlanCardType;
  heading: string;
  tagline: string;
  description: string;
  price: string;
  duration: string;
  buttonText: string;
  popularTagText?: string;
  features: { text: string; available: boolean }[];
  handleClick: () => void;
}

const PlanContainer = styled.div<{ plantype: PlanCardType } & WidthProps>`
  position: relative;
  display: flex;
  width: 400px;
  padding: 40px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border-radius: 16px;
  background: ${({ plantype, theme }) =>
    plantype === 'silver'
      ? theme.palette.background.slateLight
      : theme.palette.background.plan};
  box-shadow: 4px 4px 30px 0px ${({ theme }) => theme.palette.border.darkSlate};
  border: ${({ plantype, theme }) =>
    plantype === 'gold' && `1px solid ${theme.palette.background.golden}`};
  ${width}
`;
const PopularTag = styled.div`
  position: absolute;
  top: 0px;
  right: 32px;
  background: ${({ theme }) => theme.palette.golden};
  z-index: 1;
  border-radius: 0px 0px 6px 6px;
  padding: 8px 15px 8px 17px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PlanCard: React.FC<PlanCardProps> = ({
  plantype,
  heading,
  tagline,
  description,
  price,
  features,
  duration,
  buttonText,
  popularTagText,
  handleClick,
  ...restProps
}) => {
  const theme = useTheme();
  return (
    <PlanContainer plantype={plantype} {...restProps}>
      {popularTagText && (
        <PopularTag>
          <Typography
            $fontFamily="normal"
            $fontWeight="semibold"
            $fontSize={14}
            color="black"
            $lineHeight={10}
          >
            {popularTagText}
          </Typography>
        </PopularTag>
      )}
      <Flex direction="column" $fontFamily="normal" align="flex-start">
        <Typography
          color={plantype === 'silver' ? 'silver' : 'gold'}
          $fontSize={30}
          $fontWeight="bold"
          $lineHeight={22}
          $allowOverflow
          mb={1}
        >
          {heading}
        </Typography>
        <Typography $fontWeight="normal" $fontSize={20} color="muted">
          {tagline}
        </Typography>
      </Flex>
      <Flex align="flex-end" gap={16}>
        <Typography
          color="white"
          $fontWeight="bold"
          $fontFamily="normal"
          $fontSize={48}
          $lineHeight={33}
          $allowOverflow
        >
          {price}
        </Typography>

        <Typography
          $fontSize={16}
          $fontFamily="normal"
          $fontWeight="normal"
          color="normal"
          $lineHeight={11}
          $allowOverflow
        >
          {duration}
        </Typography>
      </Flex>

      <Typography
        color="muted"
        $fontFamily="normal"
        $fontWeight="normal"
        $fontSize={16}
        $lineHeight={24}
      >
        {description}
      </Typography>
      <Flex height={1} $bgColor="headlineLight" $alignSelf="stretch" />
      <Flex direction="column" gap={32} mt={2} mb={4} justify="center">
        {features.map((feature, index) => (
          <Flex key={`${feature.text}-${index + 1}`} align="center" gap={24}>
            {feature.available ? (
              <Check
                stroke={theme?.palette.text.greenStroke}
                strokeWidth="3.5 px"
                height={20}
                width={24}
              />
            ) : (
              <CrossIcon
                stroke={theme?.palette.text.redStroke}
                strokeWidth="3.5 px"
                height={20}
                width={24}
              />
            )}
            <Typography
              color="white"
              $fontSize={20}
              $fontFamily="normal"
              $fontWeight="normal"
              $lineHeight={14}
              $allowOverflow
            >
              {feature.text}
            </Typography>
          </Flex>
        ))}
      </Flex>
      <Button
        variant={plantype === 'silver' ? 'silver' : 'primary'}
        display="flex"
        $alignSelf="stretch"
        align="center"
        justify="center"
        $borderRadius="8px"
        $fontSize={16}
        $fontWeight="medium"
        $fontFamily="normal"
        height={48}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </PlanContainer>
  );
};
PlanCard.defaultProps = {
  popularTagText: undefined,
};
