import {
  Container,
  Typography,
  Image,
  successIcon,
  DialogueBoxContainer,
} from '@cypherock/cysync-ui';
import React from 'react';

export const Success: React.FC = () => (
  <DialogueBoxContainer
    align="center"
    justify="center"
    width={500}
    direction="column"
  >
    <Container
      display="flex"
      direction="column"
      gap={32}
      px={5}
      pb={4}
      pt={4}
      width={500}
    >
      <Image src={successIcon} alt="Success Icon" />
      <Typography variant="h5" $textAlign="center">
        Your X1 Vault is successfully authenticated
      </Typography>
    </Container>
  </DialogueBoxContainer>
);
