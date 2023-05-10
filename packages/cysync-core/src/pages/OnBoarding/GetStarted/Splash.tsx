import { Button } from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';
import { SDK } from '@cypherock/sdk-core';
import { coinList } from '@cypherock/coins';
import logger from '../../../utils/logger';

export const Splash = (): ReactElement => (
  <>
    <Button onClick={() => logger.info(SDK.create)} variation="primary">
      Get Started
    </Button>
    <Button variation="secondary" onClick={() => logger.info(coinList)}>
      Get Started
    </Button>
  </>
);
