import {
  Container,
  Typography,
  Image,
  failIcon,
  DialogueBoxFooter,
  Button,
  DialogueBoxContainer,
} from '@cypherock/cysync-ui';
import React from 'react';

export const Failure: React.FC = () => (
  <DialogueBoxContainer
    align="center"
    justify="center"
    width={500}
    direction="column"
  >
    <Container display="flex" direction="column" gap={32} px={5} pb={4} pt={4}>
      <Image src={failIcon} alt="Failure Icon" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          Device Authentication has failed
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          There seems to be an error with the ATECC firmware. Contact Cypherock
          support immediately
        </Typography>
      </Container>
    </Container>
    <DialogueBoxFooter>
      <Button variant="secondary">Support</Button>
    </DialogueBoxFooter>
  </DialogueBoxContainer>
);
