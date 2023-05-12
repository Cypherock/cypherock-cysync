import { Bullet, Button } from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';
import { SDK } from '@cypherock/sdk-core';
import { coinList } from '@cypherock/coins';
import logger from '../../../utils/logger';

export const Splash = (): ReactElement => (
  <>
    <Button onClick={() => logger.info(SDK.create)} variant="primary">
      Get Started
    </Button>
    <Button variant="secondary" onClick={() => logger.info(coinList)}>
      Get Started
    </Button>
  </>
);
