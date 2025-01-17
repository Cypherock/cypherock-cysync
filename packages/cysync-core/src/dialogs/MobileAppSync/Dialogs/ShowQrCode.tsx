import {
  CloseButton,
  DialogBox,
  DialogBoxBody,
  Divider,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';
import { useMobileAppSyncDialog } from '../context';
import { LoaderDialog } from '~/components';
import { QrCode } from '../components/QrCode';

export const ShowQrCode: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const { isLoading, onClose, getSyncData } = useMobileAppSyncDialog();
  const [chunkIndex, setChunkIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const syncData = await getSyncData();
        setData(syncData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [getSyncData]);

  useEffect(() => {
    setChunkIndex(0);
    let interval: NodeJS.Timer | undefined;
    if (data.length > 0) {
      interval = setInterval(() => {
        setChunkIndex(p => (p < data.length - 1 ? p + 1 : 0));
      }, 500);
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
          Scan the QR Code with your cySync Mobile App
        </Typography>
        {data[chunkIndex] && <QrCode data={data[chunkIndex]} />}
      </DialogBoxBody>
    </DialogBox>
  );
};
