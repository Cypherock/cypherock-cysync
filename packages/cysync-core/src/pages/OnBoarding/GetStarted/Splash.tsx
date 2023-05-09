import { Bullet, Button } from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';

export const Splash = (): ReactElement => (
  <>
    <Button variation="primary">Get Started</Button>
    <Button variation="secondary">Get Started</Button>
    <Bullet size="lg" variant="gold" />
  </>
);
