import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  Bullet,
  Button,
  Container,
  DialogueBoxBody,
  DialogueBoxContainer,
  DialogueBoxFooter,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import { Aside } from './Aside';

export const Welcome = (): ReactElement => (
  <Flex gap={0}>
    <Aside />
    <Container $bgColor="contentGradient">
      <Flex position="absolute" top={3} right={3}>
        <Typography color="muted">Help</Typography>
        <Typography color="gold">?</Typography>
      </Flex>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Typography variant="h5" color="heading" mb={1}>
            Ensure the product contains the following
          </Typography>

          <Typography variant="h6" color="muted" mb={6}>
            Make sure the tamper-proof seal of the package was intact
          </Typography>
          <Container rounded={1} $bgColor="list" mb={6}>
            <Flex justify="space-between" width="full">
              <Flex direction="column">
                <Flex align="center" gap={2} mb={2}>
                  <Bullet variant="gold" size="sm" />

                  <Typography variant="h6" color="gold" ml={1}>
                    X1 Vault
                  </Typography>
                </Flex>

                <Flex align="center" gap={2}>
                  <Bullet size="sm" />

                  <Typography variant="h6" color="muted" ml={1}>
                    4 X1 Cards
                  </Typography>
                </Flex>
              </Flex>

              <Flex direction="column">
                <Flex align="center" gap={2} mb={2}>
                  <Bullet size="sm" />

                  <Typography variant="h6" color="muted" ml={1}>
                    4 Card Covers
                  </Typography>
                </Flex>

                <Flex align="center" gap={2}>
                  <Bullet size="sm" />

                  <Typography variant="h6" color="muted" ml={1}>
                    USB Cable
                  </Typography>
                </Flex>
              </Flex>
            </Flex>
          </Container>

          <Container rounded={1} $bgColor="list" border="popup">
            <Flex>
              <Typography variant="h6" color="muted">
                Please email at{' '}
                <Typography variant="h6" color="heading" display="inline">
                  {' '}
                  support@cypherock.com{' '}
                </Typography>{' '}
                if your package does not contain any of these
              </Typography>
            </Flex>
          </Container>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Link to="/usage">
            <Button variant="primary">Get Started</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
