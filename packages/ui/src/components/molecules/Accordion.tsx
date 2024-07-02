// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { Flex } from '../atoms/Flex';

import { ArrowDown, ArrowUp, Info } from '../../assets';

export interface AccordionProps {
  header: string;
  detail: string;
}

const StyledContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 720px;
  color: #ffffff;
  background: #272320;
  border: 1px solid #39322c;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  text-align: left;
`;

const First = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
`;

const DetailContainer = styled.div`
  border-top: 1px solid #39322c;
  padding: 16px;
  color: #8b8682;
`;

const HeaderText = styled.p`
  margin-left: 16px;
`;

export const Accordion: FC<AccordionProps> = ({ header, detail }) => {
  const [IsOpen, setIsOpen] = useState(false);

  return (
    <StyledContainer
      onClick={() => setIsOpen(!IsOpen)}
      className="oneInManyContainer"
    >
      <Flex align="center" justify="space-between" m="0px 10px 0px 10px">
        <First>
          <Info />
          <HeaderText>{header}</HeaderText>
        </First>
        <Flex>{IsOpen ? <ArrowUp /> : <ArrowDown />}</Flex>
      </Flex>
      {IsOpen && <DetailContainer>{detail}</DetailContainer>}
    </StyledContainer>
  );
};
Accordion.propTypes = {
  header: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
};
