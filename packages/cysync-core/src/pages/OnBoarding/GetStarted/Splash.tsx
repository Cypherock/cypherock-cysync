import { Button } from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';
import { coinList } from '@cypherock/coins';
import logger from '../../../utils/logger';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import {
  addRandomWallet,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '../../../store';

export const Splash = (): ReactElement => {
  const { connection } = useDevice();

  const wallets = useAppSelector(selectWallets);
  const dispatch = useAppDispatch();

  return (
    <>
      <div>
        <Button variant="primary" onClick={() => dispatch(addRandomWallet())}>
          Get Started
        </Button>
        <Button variant="secondary" onClick={() => logger.info(coinList)}>
          Get Started
        </Button>
      </div>
      <div>{JSON.stringify(wallets)}</div>
      <div style={{ whiteSpace: 'pre-line' }}>
        {!connection && `No device connected`}
        {connection?.status === DeviceConnectionStatus.CONNECTED &&
          `Device connected: ${JSON.stringify(connection, undefined, 2)}`}
        {connection?.status === DeviceConnectionStatus.UNKNOWN_ERROR &&
          `Error connecting device: ${JSON.stringify(
            connection,
            undefined,
            2,
          )}`}
      </div>
    </>
  );
};
