import { Bullet, Button } from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';

export const Splash = (): ReactElement => (
  <>
    <Button variant="primary">Get Started</Button>
    <Button variant="secondary">Get Started</Button>
    <Bullet size="lg" variant="gold" />
  </>
);
