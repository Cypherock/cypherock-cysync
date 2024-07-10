// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { Flex } from '../atoms/Flex';

import { ArrowDown, ArrowUp, Info } from '../../assets';
import { colors } from '../../themes/color.styled';

export interface AccordionProps {
  header: string;
  detail: string;
}

const StyledContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 720px;
  color: ${colors.text.message};
  background: ${colors.background.separatorSecondary};
  border: 1px solid ${colors.border.separator};
  font-family: Poppins;
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  text-align: left;
`;

const First = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${colors.text.message};
  height: auto;
  width: 100%;
`;

const DetailContainer = styled.div`
  border-top: 1px solid ${colors.border.separator};
  padding: 16px;
  color: ${colors.text.muted};
`;

const HeaderText = styled.p`
  margin-left: 16px;
  display: flex;
`;

export const Accordion: FC<AccordionProps> = ({ header, detail }) => {
  const [IsOpen, setIsOpen] = useState(false);

  return (
    <StyledContainer onClick={() => setIsOpen(!IsOpen)}>
      <Flex
        align="center"
        justify="space-between"
        m="0px 16px"
        width="688px"
        height="44px"
      >
        <First>
          <Info />
          <HeaderText>{header}</HeaderText>
        </First>
        <Flex>{IsOpen ? <ArrowDown /> : <ArrowUp />}</Flex>
      </Flex>
      {IsOpen && <DetailContainer>{detail}</DetailContainer>}
    </StyledContainer>
  );
};
Accordion.propTypes = {
  header: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
};
