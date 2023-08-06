import {
  Container,
  Flex,
  SearchBar,
  Table,
  TableHeader,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { styled } from 'styled-components';
import { openSendDialog } from '~/actions';
import { useAppDispatch } from '~/store';

const TableHeaderDataStyle = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 16px 40px;
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
          <TableHeader width="full">
            <TableHeaderDataStyle>
              <Typography variant="span">Monday, 16th July 2023</Typography>
            </TableHeaderDataStyle>
          </TableHeader>
        </Table>
      </Flex>
    </Container>
  );
};
