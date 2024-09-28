import React from 'react';
import styled from 'styled-components';

import { Check, CrossIcon } from '../../assets';
import { useTheme } from '../../themes';
import { Button, Flex, Typography } from '../atoms';
import { WidthProps, width } from '../utils';

export type PlanCardType = 'silver' | 'gold';

export interface PlanCardProps extends WidthProps {
  type: PlanCardType;
  heading: string;
  description: string;
  buttonText: string;
  popularTagText?: string;
  features: { text: string; available: boolean }[];
  onClick: () => void;
}

const PlanContainer = styled.div<{ type: PlanCardType } & WidthProps>`
  position: relative;
  display: flex;
  width: 400px;
  padding: 40px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border-radius: 16px;
  background: ${({ type, theme }) =>
    type === 'silver'
      ? theme.palette.background.slateLight
      : theme.palette.background.plan};
  box-shadow: 4px 4px 30px 0px ${({ theme }) => theme.palette.border.darkSlate};
  border: ${({ type, theme }) =>
    type === 'gold' && `1px solid ${theme.palette.background.golden}`};
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
  type,
  heading,
  description,
  features,
  buttonText,
  popularTagText,
  onClick,
  ...restProps
}) => {
  const theme = useTheme();
  return (
    <PlanContainer type={type} {...restProps}>
      {popularTagText && (
        <PopularTag>
          <Typography
            $fontFamily="normal"
            $fontWeight="semibold"
            $fontSize={14}
            color="black"
            $lineHeight={10}
            $allowOverflow
          >
            {popularTagText}
          </Typography>
        </PopularTag>
      )}
      <Flex direction="column" $fontFamily="normal" align="flex-start">
        <Typography
          color={type === 'silver' ? 'silver' : 'gold'}
          $fontSize={30}
          $fontWeight="bold"
          $lineHeight={22}
          $allowOverflow
          mb={1}
        >
          {heading}
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
      <Flex height={1} $bgColor="separator" $alignSelf="stretch" />
      <Flex direction="column" gap={32} mt={2} mb={4} justify="center">
        {features.map((feature, index) => (
          <Flex key={`${feature.text}-${index + 1}`} align="center" gap={24}>
            {feature.available ? (
              <Check
                stroke={theme.palette.text.greenStroke}
                strokeWidth="3.5 px"
                height={20}
                width={24}
              />
            ) : (
              <CrossIcon
                stroke={theme.palette.text.redStroke}
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
        variant={type === 'silver' ? 'silver' : 'primary'}
        display="flex"
        $alignSelf="stretch"
        align="center"
        justify="center"
        $borderRadius="8px"
        $fontSize={16}
        $fontWeight="medium"
        $fontFamily="normal"
        height={48}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </PlanContainer>
  );
};
PlanCard.defaultProps = {
  popularTagText: undefined,
};
