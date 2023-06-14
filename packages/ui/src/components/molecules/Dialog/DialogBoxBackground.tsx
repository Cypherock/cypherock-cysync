import React from 'react';

import { backIcon } from '../../../assets/images';
import {
  Flex,
  Container,
  Button,
  Typography,
  LangDisplay,
  Image,
} from '../../atoms';

export interface DialogBoxBackgroundHeaderProps {
  topLeftComponent?: React.ReactNode | undefined;
  topRightComponent?: React.ReactNode | undefined;
}

export const DialogBoxBackgroundHeader: React.FC<
  DialogBoxBackgroundHeaderProps
> = ({ topLeftComponent, topRightComponent }) => (
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
    <Container>{topLeftComponent}</Container>
    <Container>{topRightComponent}</Container>
  </Flex>
);

DialogBoxBackgroundHeader.defaultProps = {
  topLeftComponent: undefined,
  topRightComponent: undefined,
};

export interface DialogBoxBackgroundFooterProps {
  backText: string | undefined;
}

export const DialogBoxBackgroundFooter: React.FC<
  DialogBoxBackgroundFooterProps
> = ({ backText }) => (
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
    {backText && (
      <Button variant="none">
        <Flex gap={8}>
          <Image src={backIcon} alt="Back" />
          <Typography color="muted" fontSize={14}>
            <LangDisplay text={backText} />
          </Typography>
        </Flex>
      </Button>
    )}
  </Flex>
);

export const DialogBoxBackground: React.FC<{ children: React.ReactNode }> = ({
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
