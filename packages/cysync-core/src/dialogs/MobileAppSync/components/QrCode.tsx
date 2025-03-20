import { Container } from '@cypherock/cysync-ui';
import React from 'react';
import QRCode from 'react-qr-code';

export const QrCode = ({ data }: { data: string }) => (
  <Container p={2} width={308} height={308} $bgColor="white">
    <QRCode size={300} value={data} key={data} />
  </Container>
);
