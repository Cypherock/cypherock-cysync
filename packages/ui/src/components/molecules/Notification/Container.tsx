import React from 'react';
import styled from 'styled-components';

import { addKeyboardEvents } from '../../../hooks';
import {
  CloseButton,
  Container,
  Flex,
  ScrollableContainer,
  Typography,
} from '../../atoms';

const NotificationOverlayStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 50;
`;

const NotificationContainerStyle = styled.div<
  Pick<NotificationContainerProps, 'top'>
>`
  position: absolute;
  top: ${props => props.top ?? 200}px;
  right: 0;
  width: 444px;
  background: ${({ theme }) => theme.palette.background.primary};
  border: 1px solid ${({ theme }) => theme.palette.border.popup};
  z-index: 1;
`;

export interface NotificationContainerProps {
  onClose: () => void;
  dontCloseOnEscape?: boolean;
  children: React.ReactNode;
  title: string;
  count: number;
  top?: number;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  onClose,
  children,
  title,
  count,
  top,
  dontCloseOnEscape,
}) => {
  const onEscape = (e: KeyboardEvent) => {
    if (!dontCloseOnEscape && onClose) {
      (onClose as any)(e);
      e.stopPropagation();
    }
  };

  addKeyboardEvents({
    Escape: onEscape,
  });

  return (
    <NotificationOverlayStyle onClick={onClose}>
      <NotificationContainerStyle top={top} onClick={e => e.stopPropagation()}>
        <Flex
          position="relative"
          width="full"
          justify="flex-start"
          align="center"
          $height="40px"
          $minHeight="40px"
          my="20px"
          pl="40px"
          pr="20px"
        >
          <Container justify="flex-start">
            <Typography color="white">{title}</Typography>
            {count > 0 && (
              <Container
                $bgColor="separator"
                $borderRadius="50%"
                width="30px"
                height="30px"
                ml={2}
              >
                <Typography
                  color="gold"
                  $fontWeight="semibold"
                  $textOverflow="clip"
                >
                  {count}
                </Typography>
              </Container>
            )}
          </Container>
          <CloseButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            $alignSelf="end"
            position="absolute"
            top={0.5}
            $translateY={-0.5}
            right="20px"
          />
        </Flex>
        <Container pt="20px" direction="column">
          <ScrollableContainer
            $maxHeight={`calc(100vh - ${(top ?? 0) + 120}px)`}
            pb="40px"
          >
            {children}
          </ScrollableContainer>
        </Container>
      </NotificationContainerStyle>
    </NotificationOverlayStyle>
  );
};

NotificationContainer.defaultProps = {
  top: undefined,
  dontCloseOnEscape: undefined,
};
