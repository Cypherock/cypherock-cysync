// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { ArrowDown, ArrowUp, info } from '../../assets';
import { Flex } from './Flex';

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
  color: #ffffff;
`;

const DetailContainer = styled.div`
  border-top: 1px solid #39322c;
  padding: 16px;
  color: #8b8682;
`;

const InfoImage = styled.img.attrs({
  src: info,
  alt: 'clock',
})``;

export const Accordion: FC<AccordionProps> = ({ header, detail }) => {
  const [IsOpen, setIsOpen] = useState(false);

  return (
    <StyledContainer
      onClick={() => setIsOpen(!IsOpen)}
      className="oneInManyContainer"
    >
      <Flex>
        <First>
          <InfoImage />
          <p style={{ marginLeft: '16px' }}> {header} </p>
        </First>
        <div>{IsOpen ? <ArrowUp /> : <ArrowDown />}</div>
      </Flex>
      {IsOpen && <DetailContainer>{detail}</DetailContainer>}
    </StyledContainer>
  );
};
Accordion.propTypes = {
  header: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
};
