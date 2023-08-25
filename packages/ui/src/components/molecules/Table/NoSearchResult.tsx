import React, { FC } from 'react';
import { styled } from 'styled-components';
import { NotFound } from '../../../assets';
import { Flex, Typography } from '../../atoms';

interface NoSearchResultProps {
  text: string;
  subText?: string;
}

const NoSearchResultWrapper = styled.div`
  display: flex;
  margin-top: 48px;
  padding-top: 32px;
  justify-content: center;
  width: 100%;
  height: 80vh;
`;

export const NoSearchResult: FC<NoSearchResultProps> = ({ text, subText }) => (
  <NoSearchResultWrapper>
    <Flex direction="column" gap={64} align="center">
      <NotFound width={100} height={100} />
      <Flex direction="column" align="center">
        <Typography variant="h5" $fontWeight="medium">
          {text}
        </Typography>
        <Typography variant="p" color="muted">
          {subText}
        </Typography>
      </Flex>
    </Flex>
  </NoSearchResultWrapper>
);

NoSearchResult.defaultProps = {
  subText: '',
};
