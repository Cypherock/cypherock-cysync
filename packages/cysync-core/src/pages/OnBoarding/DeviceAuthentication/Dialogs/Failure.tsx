import {
  Container,
  Typography,
  Image,
  failIcon,
  DialogBoxFooter,
  Button,
  DialogBox,
  DialogBoxBody,
} from '@cypherock/cysync-ui';
import React from 'react';

export const Failure: React.FC = () => (
  <DialogBox width={500}>
    <DialogBoxBody>
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
    </DialogBoxBody>
    <DialogBoxFooter>
      <Button variant="secondary">Support</Button>
    </DialogBoxFooter>
  </DialogBox>
);
