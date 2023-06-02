import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  ListContainer,
  ListItem,
  Typography,
  Aside,
  cysyncLogoBig,
} from '@cypherock/cysync-ui';

const list: Array<{ index: number; text: string }> = [
  {
    index: 1,
    text: 'You are present in a safe and secure environment',
  },
  {
    index: 2,
    text: 'You have atleast 15-30 minutes to setup your wallet',
  },
  {
    index: 3,
    text: 'You have an active internet connection',
  },
  {
    index: 4,
    text: 'The tamper-proof seal of the package is intact',
  },
  {
    index: 5,
    text: 'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
  },
  {
    index: 6,
    text: 'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
  },
];

const listItems = list.map(li => (
  <ListItem key={li.index} width="full">
    <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
      {li.text}
    </Typography>
  </ListItem>
));

export const Information = (): ReactElement => (
  <Flex width="full" gap={0}>
    <Aside type="getStarted" img={cysyncLogoBig} />
    <Container width="full" $bgColor="contentGradient">
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader />
        <DialogBox direction="column" align="center" width={700}>
          <DialogBoxBody direction="column" align="center">
            <Typography variant="h5" color="heading" $textAlign="center">
              Ensure the following before you continue
            </Typography>
            <Container $bgColor="list" direction="column">
              <ListContainer p={4} direction="column" width="full">
                {listItems}
              </ListContainer>
            </Container>
          </DialogBoxBody>
          <DialogBoxFooter>
            <Link to="/usage">
              <Button variant="primary">Continue</Button>
            </Link>
          </DialogBoxFooter>
        </DialogBox>
      </DialogBoxBackground>
    </Container>
  </Flex>
);
