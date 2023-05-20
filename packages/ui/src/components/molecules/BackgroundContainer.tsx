import React from 'react';
import { Container, Flex, Typography, Image, Button } from '../atoms';
import { backIcon, emailIcon } from '../../assets/images';

interface BackgroundHeaderBarProps {
  email: boolean | undefined;
  help: boolean | undefined;
}

export const BackgroundHeaderBar: React.FC<BackgroundHeaderBarProps> = ({
  email,
  help,
}) => (
  <Flex
    position="absolute"
    top={0}
    width="full"
    justify="space-between"
    p={{
      def: 1,
      lg: 5,
    }}
  >
    <Container>
      {email && (
        <Flex gap={16} $bgColor="highlight" rounded={10} pr={1}>
          <Image src={emailIcon} width={24} alt="Email Icon" />
          <Typography color="muted" fontSize={14}>
            user@email.com
          </Typography>
        </Flex>
      )}
    </Container>
    <Container>
      {help && (
        <Button variant="none">
          <Flex gap={8}>
            <Typography color="muted" fontSize={14}>
              Help
            </Typography>
            <Typography color="gold" fontSize={14}>
              ?
            </Typography>
          </Flex>
        </Button>
      )}
    </Container>
  </Flex>
);

export const BackgroundFooterBar = () => (
  <Flex
    position="absolute"
    bottom={0}
    width="full"
    justify="flex-start"
    p={{
      def: 1,
      lg: 5,
    }}
  >
    <Button variant="none">
      <Flex gap={8}>
        <Image src={backIcon} alt="Back" />
        <Typography color="muted" fontSize={14}>
          Back
        </Typography>
      </Flex>
    </Button>
  </Flex>
);

export const BackgroundContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Container
    $bgColor="contentGradient"
    height="full"
    width="full"
    align="center"
    position="relative"
    justify="center"
    display="flex"
    grow={1}
  >
    {children}
  </Container>
);
