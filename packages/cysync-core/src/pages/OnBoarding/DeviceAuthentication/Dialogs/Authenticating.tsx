import { Container, Typography, Image } from '@cypherock/cysync-ui';
import React from 'react';
import { theme } from '@cypherock/cysync-ui/src/themes/theme.styled';
import { loader } from '../../../../assets/images/onboarding';

export const Authenticating: React.FC = () => (
  <Container
    $bgColor="primary"
    align="center"
    justify="center"
    width={500}
    height={267}
    shadow="popup"
    rounded={16}
    direction="column"
    display="flex"
    gap={34}
    px={5}
    pb={8}
    pt={4}
  >
    <Image src={loader} alt="loader" animate="spin" $animDuration={3} />
    <Typography variant="h5" $textAlign="center">
      Your X1 Vault will now be authenticated
      <br />
      through Cypherock to check its
      <br /> authenticity...(
      <span
        style={{
          background: theme.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        ?
      </span>
      )
    </Typography>
  </Container>
);
