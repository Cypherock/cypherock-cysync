import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from './Components';
import {
  ArrowReceivedIcon,
  Table,
  TableNoData,
  useTheme,
} from '@cypherock/cysync-ui';
import { HistoryTable } from './Components/HistoryTable';

export const History: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const theme = useTheme();

  return (
    <MainAppLayout title={strings.sidebar.history}>
      <Table width="full" height="screen">
        <TableNoData
          icon={<ArrowReceivedIcon fill={theme.palette.text.success} />}
          text="No transactions yet"
          subText="Receive Crypto today to see your transaction history here"
          buttonText="Receive"
        />
      </Table>
      <HistoryTable />
    </MainAppLayout>
  );
};
