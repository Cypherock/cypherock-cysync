import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Container,
  Flex,
  Typography,
} from '../../../components';
import { Aside } from './Aside';

export const Welcome = (): ReactElement => {
  // states
  const [activeElement, setActiveElement] = useState<number>(1);
  const [activeText, setActiveText] = useState<string>('');

  // effects
  useEffect(() => {
    setInterval(() => {
      setActiveElement((prevProps: number) => {
        if (prevProps === 5) {
          return 0;
        }

        return prevProps + 1;
      });
    }, 5000);
  }, []);

  useEffect(() => {
    if (activeElement === 1) {
      setActiveText('Text 1');
    } else if (activeElement === 2) {
      setActiveText('Text 2');
    } else if (activeElement === 3) {
      setActiveText('Text 3');
    } else if (activeElement === 4) {
      setActiveText('Text 4');
    }
  }, [activeElement]);

  return (
    <Flex gap="gap0">
      <Aside text={activeText} />
      <Container variant="container" bgColor="contentGratient">
        <Flex position="absolute" top="topThree" right="rightThree">
          <Typography color="textMuted">Help</Typography>
          <Typography color="textGold">?</Typography>
        </Flex>
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbOne">
              Ensure the product contains the following
            </Typography>

            <Typography variant="h6" color="textMuted" mb="mbSix">
              Make sure the tamper-proof seal of the package was intact
            </Typography>
            <Container rounded="roundedOne" bgColor="list" mb="mbSix">
              <Flex justify="between" width="wFull">
                <Flex direction="column">
                  <Flex align="center" gap="gapTwo" mb="mbTwo">
                    <Bullet
                      variant={activeElement === 1 ? 'gold' : undefined}
                      size="sm"
                    />

                    <Typography
                      variant="h6"
                      color={activeElement === 1 ? 'textGold' : 'textMuted'}
                    >
                      X1 Vault
                    </Typography>
                  </Flex>

                  <Flex align="center" gap="gapTwo">
                    <Bullet
                      variant={activeElement === 2 ? 'gold' : undefined}
                      size="sm"
                    />

                    <Typography
                      variant="h6"
                      color={activeElement === 2 ? 'textGold' : 'textMuted'}
                    >
                      4 X1 Cards
                    </Typography>
                  </Flex>
                </Flex>

                <Flex direction="column">
                  <Flex align="center" gap="gapTwo" mb="mbTwo">
                    <Bullet
                      variant={activeElement === 3 ? 'gold' : undefined}
                      size="sm"
                    />

                    <Typography
                      variant="h6"
                      color={activeElement === 3 ? 'textGold' : 'textMuted'}
                    >
                      4 Card Covers
                    </Typography>
                  </Flex>

                  <Flex align="center" gap="gapTwo">
                    <Bullet
                      variant={activeElement === 4 ? 'gold' : undefined}
                      size="sm"
                    />

                    <Typography
                      variant="h6"
                      color={activeElement === 4 ? 'textGold' : 'textMuted'}
                    >
                      USB Cable
                    </Typography>
                  </Flex>
                </Flex>
              </Flex>
            </Container>

            <Container rounded="roundedOne" bgColor="list" border>
              <Flex>
                <Typography variant="h6" color="textMuted">
                  Please email at{' '}
                  <Typography variant="h6" color="textHeading" display="inline">
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
              <Button variation="primary">Get Started</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
