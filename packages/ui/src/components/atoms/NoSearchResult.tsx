import React, { FC } from 'react';
import { styled } from 'styled-components';

import { Flex } from './Flex';
import { Typography } from './Typography';

interface NoSearchResultProps {
  image: React.ReactNode;
  text: string;
  searchText: string;
  subText?: string;
}

const NoSearchResultWrapper = styled.div`
  padding: 32px 0px;
  margin-top: 48px;
`;

export const NoSearchResult: FC<NoSearchResultProps> = ({
  image,
  text,
  searchText,
  subText,
}) => (
  <NoSearchResultWrapper>
    <Flex direction="column" gap={64} align="center">
      {image}
      <Flex direction="column" align="center">
        <Typography $fontSize={24} $fontWeight="medium">
          {`${text} "${searchText}"`}
        </Typography>
        <Typography $fontSize={16} color="muted">
          {subText}
        </Typography>
      </Flex>
    </Flex>
  </NoSearchResultWrapper>
);

NoSearchResult.defaultProps = {
  subText: '',
};
