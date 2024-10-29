// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC } from 'react';
import { styled } from 'styled-components';

import { AngleDown, InfoItalicsIcon } from '../../assets';
import { Typography, Flex } from '../atoms';
import {
  FlexProps,
  flex,
  utils,
  width,
  WidthProps,
  UtilsProps,
} from '../utils';

export interface AccordionProps extends WidthProps {
  id: string;
  title: string;
  content: string;
}

const HeaderTitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${({ theme }) => theme.palette.text.message};
  height: auto;
  width: 100%;
`;

const DetailsContainer = styled.div`
  border-top: 0px solid ${({ theme }) => theme.palette.border.separator};
  transition: max-height ease-in-out 0.5s, border-top step-end 0.5s;
  max-height: 0px;
`;

const ArrowContainer = styled(Flex)`
  transition: transform ease-in-out 0.5s;
`;

const HeaderContainer = styled.label<FlexProps & UtilsProps>`
  display: flex;
  ${flex}
  ${utils}
`;

const StyledContainer = styled.div<WidthProps>`
  border-radius: 8px;
  overflow: hidden;
  width: 720px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  line-height: 18px;
  text-align: left;

  ${width}

  input {
    display: none;
  }

  input:checked ~ ${HeaderContainer} ${ArrowContainer} {
    transform: rotate(180deg);
  }

  input:checked ~ ${DetailsContainer} {
    max-height: 100vh;
    transition: max-height ease-in-out 1s, border-top step-start 1s;
    border-top: 1px solid ${({ theme }) => theme.palette.border.separator};
  }
`;

export const Accordion: FC<AccordionProps> = ({
  id,
  title,
  content,
  ...restProps
}) => {
  const inputId = `accordion-${id}`;

  return (
    <StyledContainer {...restProps}>
      <input id={inputId} type="checkbox" />
      <HeaderContainer
        align="center"
        justify="space-between"
        p="0px 16px"
        $width="full"
        $height="44px"
        $cursor="pointer"
        htmlFor={inputId}
      >
        <HeaderTitleContainer>
          <InfoItalicsIcon width="12px" height="12px" />
          <Typography display="flex" ml={2} $fontSize={12} $fontWeight="light">
            {title}
          </Typography>
        </HeaderTitleContainer>
        <ArrowContainer>
          <AngleDown />
        </ArrowContainer>
      </HeaderContainer>
      <DetailsContainer>
        <Typography
          p={2}
          color="muted"
          $fontSize={12}
          $fontWeight="light"
          $whiteSpace="pre-line"
        >
          {content}
        </Typography>
      </DetailsContainer>
    </StyledContainer>
  );
};

Accordion.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
