import {
  CloseButton,
  DialogBox,
  DialogBoxBody,
  Divider,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { QrCode } from '../components/QrCode';
import { useMobileAppSyncDialog } from '../context';

const QR_CODE_FRAME_DELAY = 500;

export const ShowQrCode: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const { isLoading, onClose, getSyncData } = useMobileAppSyncDialog();
  const [chunkIndex, setChunkIndex] = useState(0);
  const { strings } = useAppSelector(selectLanguage);

  useEffect(() => {
    (async () => {
      try {
        const syncData = await getSyncData();
        setData(syncData);
      } catch (error) {
        logger.error('Failed to retrieve sync data');
        logger.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    setChunkIndex(0);
    let interval: NodeJS.Timer | undefined;
    if (data.length > 0) {
      interval = setInterval(() => {
        setChunkIndex(p => (p + 1) % data.length);
      }, QR_CODE_FRAME_DELAY);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data]);

  if (isLoading) return <LoaderDialog />;

  return (
    <DialogBox width={500} align="stretch" onClose={onClose}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody
        gap={{ def: 16, lg: 32 }}
        px={{ def: 3, lg: 5 }}
        pt={{ def: 4, lg: 4 }}
        pb={{ def: 2, lg: 4 }}
        align="center"
      >
        <Typography color="white" $fontSize={20} $textAlign="center">
          {strings.settings.tabs.general.item.syncMobile.title}
        </Typography>
        {data[chunkIndex] && <QrCode data={data[chunkIndex]} />}
      </DialogBoxBody>
    </DialogBox>
  );
};
