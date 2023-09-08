import React, { FC } from 'react';
import { styled } from 'styled-components';

import { Flex } from './Flex';
import { Typography } from './Typography';

import { NotFound } from '../../assets';

interface NoSearchResultProps {
  image?: React.ReactNode;
  text: string;
  searchText?: string;
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
      <Flex direction="column" align="center" px={2}>
        <Typography $fontSize={24} $fontWeight="medium" $wordBreak="break-all">
          {searchText ? `${text} "${searchText.trim()}"` : text}
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
  searchText: '',
  image: <NotFound width={100} height={100} />,
};
