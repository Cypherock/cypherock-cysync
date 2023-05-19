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

export const Information = (): ReactElement => {
  const list = [
    'You are present in a safe and secure environment',
    'You have atleast 15-30 minutes to setup your wallet',
    'You have an active internet connection',
    'The tamper-proof seal of the package is intact',
    'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
    'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
  ];
  const listItems = list.map(li => (
    <ListItem width="full">
      <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
        {li}
      </Typography>
    </ListItem>
  ));
  return (
    <Flex gap={0}>
      <Aside />
      <Container width="full" $bgColor="contentGradient">
        <DialogueBoxContainer direction="column" align="center" width={700}>
          <DialogueBoxBody direction="column" align="center">
            <Typography variant="h5" color="heading" mb={6} $textAlign="center">
              Ensure the following before you continue
            </Typography>

            <Container $bgColor="list" direction="column">
              <ListContainer p={4} direction="column" width="full">
                {listItems}
              </ListContainer>
            </Container>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/usage">
              <Button variant="primary">Continue</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
