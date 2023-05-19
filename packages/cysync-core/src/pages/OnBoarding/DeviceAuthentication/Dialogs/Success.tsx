import {
  Container,
  Typography,
  Image,
  successIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

export const Success: React.FC = () => (
  <Container
    $bgColor="primary"
    align="center"
    justify="center"
    width={500}
    shadow="popup"
    rounded={16}
    direction="column"
    display="flex"
    gap={32}
    px={5}
    pb={4}
    pt={4}
  >
    <Image src={successIcon} alt="Success Icon" />
    <Typography variant="h5" $textAlign="center">
      Your X1 Vault is successfully authenticated
    </Typography>
  </Container>
);
