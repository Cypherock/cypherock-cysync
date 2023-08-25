import React, { FC, useState } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { HistoryTable, MainAppLayout } from './Components';
import {
  ArrowReceivedIcon,
  Table,
  TableNoData,
  useTheme,
  HistoryContainer,
} from '@cypherock/cysync-ui';
import { addKeyboardEvents } from '~/hooks';

export const History: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const theme = useTheme();
  const [showTable, setShowTable] = useState(true);
  const [showNoData, setShowNoData] = useState(false);

  const keyboardActions = {
    ArrowLeft: () => {
      setShowTable(true);
      setShowNoData(false);
    },
    ArrowRight: () => {
      setShowTable(false);
      setShowNoData(true);
    },
  };

  addKeyboardEvents(keyboardActions);

  return (
    <MainAppLayout title={strings.sidebar.history}>
      <HistoryContainer>
        <Table width="full">
          {showTable && <HistoryTable />}
          {showNoData && (
            <TableNoData
              icon={<ArrowReceivedIcon fill={theme.palette.text.success} />}
              text={strings.history.noData.text}
              subText={strings.history.noData.subText}
              buttonText={strings.history.noData.buttonText}
            />
          )}
        </Table>
      </HistoryContainer>
    </MainAppLayout>
  );
};
