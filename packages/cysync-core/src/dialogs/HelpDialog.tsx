import { CloseButton, Flex } from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { closeDialog, useAppDispatch } from '..';
import HelpContent from '../pages/MainApp/Help/HelpList';
import styled from 'styled-components';

const OuterDiv = styled.div`
  background-image: ${({ theme }) => theme.palette.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.popup};
  border-color: ${({ theme }) => theme.palette.border.popup};
  height: inherit;
  margin-left: 70%;
`;

const BlurOverlayStyle = styled.div`
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(3px);
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 99;
  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
  }
`;

const DialogDiv = styled.div`
  margin: 20px;
`;

export const HelpDialog: FC = () => {
  const dispatch = useAppDispatch();
  const onClose = () => dispatch(closeDialog('helpDialog'));

  return (
    <BlurOverlayStyle>
      <OuterDiv>
        <DialogDiv>
          <Flex
            position="relative"
            width="full"
            justify="center"
            align="center"
          >
            <CloseButton
              onClick={onClose}
              $alignSelf="end"
              position="absolute"
              top={0.5}
              $translateY={-0.5}
              right={0}
            />
          </Flex>
        </DialogDiv>
        <HelpContent />
      </OuterDiv>
    </BlurOverlayStyle>
  );
};
