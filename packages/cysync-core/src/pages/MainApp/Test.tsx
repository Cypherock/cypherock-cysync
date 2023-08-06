import {
  Container,
  Flex,
  SearchBar,
  Table,
  TableHeader,
  Typography,
  HistoryNameBox,
  HistoryAssetBox,
  arrowGoldenForward,
  TableDataRow,
  TableBody,
  TableNameBox,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { styled } from 'styled-components';
import { openSendDialog } from '~/actions';
import { useAppDispatch } from '~/store';

const TableHeaderDataStyle = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 16px 40px;
  background-color: ${({ theme }) => theme.palette.background.toggleActive};
`;

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      {/* <SideBar /> */}
      <Flex direction="column" grow={1} $alignSelf="start">
        {/* <Topbar />
        <AssetAllocation /> */}
        {/* <Receive /> */}
        {/* HERLLO */}
        <Table width="full">
          <SearchBar placeholder="Search" />
          <TableHeader width="full" />
          <TableBody width="full">
            <TableHeaderDataStyle>
              <Typography variant="span">Monday, 16th July 2023</Typography>
            </TableHeaderDataStyle>
            <TableDataRow width="full">
              <HistoryNameBox
                icon={arrowGoldenForward}
                title="Received"
                subtitle="1:10 PM"
                date="03/11/23"
              />
              <HistoryAssetBox size="small" asset="Ethereum" />
              <HistoryAssetBox
                wallet="Cypherock Red"
                size="big"
                asset="Ethereum 1"
              />
              <TableNameBox text="0.0178 ETH" />
              <TableNameBox text="$2.987" />
            </TableDataRow>
          </TableBody>
        </Table>
      </Flex>
    </Container>
  );
};
