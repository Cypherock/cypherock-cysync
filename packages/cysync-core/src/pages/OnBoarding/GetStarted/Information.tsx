import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  DialogueBoxBody,
  DialogueBoxContainer,
  DialogueBoxFooter,
  Flex,
  ListContainer,
  ListItem,
  Typography,
} from '@cypherock/cysync-ui';
import { Aside } from './Aside';

export const Information = (): ReactElement => (
  <Flex gap={0}>
    <Aside />
    <Container width="full" $bgColor="contentGradient">
      <DialogueBoxContainer lg>
        <DialogueBoxBody>
          <Typography variant="h5" color="heading" mb={6} $textAlign="center">
            Ensure the following before you continue
          </Typography>

          <Container $bgColor="list" direction="column">
            <ListContainer p={4} direction="column" width="full">
              <ListItem width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  You are present in a safe and secure environment
                </Typography>
              </ListItem>
              <ListItem width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  You have atleast 15-30 minutes to setup your wallet
                </Typography>
              </ListItem>
              <ListItem width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  You have an active internet connection
                </Typography>
              </ListItem>
              <ListItem width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  The tamper-proof seal of the package is intact
                </Typography>
              </ListItem>
              <ListItem width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  Cypherock will never ask you for your seed phrase nor will it
                  ever ask you to sign a transaction{' '}
                </Typography>
              </ListItem>
              <ListItem width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  Cypherock will only email you from cypherock.com. Do not trust
                  any email from any other website domain{' '}
                </Typography>
              </ListItem>
            </ListContainer>
          </Container>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Link to="/welcome">
            <Button variant="primary">Continue</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
