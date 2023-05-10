import { Button } from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';
import { SDK } from '@cypherock/sdk-core';
import { coinList } from '@cypherock/coins';

export const Splash = (): ReactElement => (
  <>
    <Button onClick={() => console.log(SDK.create)} variation="primary">
      Get Started
    </Button>
    <Button variation="secondary" onClick={() => console.log(coinList)}>
      Get Started
    </Button>
  </>
);
