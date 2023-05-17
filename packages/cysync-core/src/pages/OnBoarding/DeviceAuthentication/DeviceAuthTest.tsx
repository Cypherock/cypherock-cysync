import React, { ReactElement } from 'react';
import { Container, Typography } from '@cypherock/cysync-ui';
import { Aside } from './Aside';

export const DeviceAuthTest = (): ReactElement => (
  <Container bgColor="sideBar">
    <Aside />
    <Container
      bgColor="contentGratient"
      height="screen"
      width="full"
      align="center"
      justify="center"
    >
      <Container bgColor="list">
        <Typography>
          Your X1 vault will now be authenticated through Cypherock. Wait
        </Typography>
      </Container>
    </Container>
  </Container>
);
