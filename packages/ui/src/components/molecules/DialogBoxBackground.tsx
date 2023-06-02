import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Flex,
  Typography,
  Image,
  Button,
  LangDisplay,
} from '../atoms';
import { backIcon } from '../../assets/images';
import { UtilsProps } from '../utils';

export interface DialogBoxBackgroundHeaderProps {
  topLeftComponent?: React.ReactNode | undefined;
  topRightComponent?: React.ReactNode | undefined;
}

export const DialogBoxBackgroundHeader: React.FC<
  DialogBoxBackgroundHeaderProps
> = ({ topLeftComponent, topRightComponent }) => (
  <Flex
    position="absolute"
    top={6}
    right={6}
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
    left={0}
    width="full"
    justify="flex-start"
    p={{
      def: 1,
      lg: 5,
    }}
  >
    {backText && (
      <Link to="/">
        <Button variant="none">
          <Flex gap={8}>
            <Image src={backIcon} alt="Back" />
            <Typography color="muted" fontSize={14}>
              <LangDisplay text={backText} />
            </Typography>
          </Flex>
        </Button>
      </Link>
    )}
  </Flex>
);

interface DialogBoxBackgroundProps extends UtilsProps {
  children: ReactNode;
}

export const DialogBoxBackground: React.FC<DialogBoxBackgroundProps> = ({
  children,
  ...props
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
    {...props}
  >
    {children}
  </Container>
);
