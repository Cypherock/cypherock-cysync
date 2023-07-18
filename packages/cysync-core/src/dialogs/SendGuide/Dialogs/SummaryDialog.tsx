import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  ImageContainer,
  bitcoinIcon,
  StretchedTypography,
  Flex,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../context';
import { styled } from 'styled-components';

export const SummaryDialog: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const Main = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const LeftContainer = styled.div`
    display: flex;
    align-items: center;
  `;

  const Icon = styled.img`
    width: 24px; /* Adjust the width of the icon as needed */
    height: 24px; /* Adjust the height of the icon as needed */
    margin-right: 5px;
  `;

  const RightContainer = styled.div`
    display: flex;
    align-items: center;
  `;

  const Text = styled.span`
    margin-right: 5px;
    font-size: 2px;
  `;

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text="Send Crypto" />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody>
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text="Summary" />
          </Typography>

          <Flex direction="row" align="flex-start">
            <ImageContainer>
              <Image
                src={bitcoinIcon}
                alt="Left Image"
                width="20px"
                height="16px"
              />
            </ImageContainer>
            <StretchedTypography
              shouldStretch={false}
              variant="fineprint"
              color="muted"
            >
              From
            </StretchedTypography>
          </Flex>

          <Main>
            <LeftContainer>
              <Icon src={bitcoinIcon} alt="Icon" />
              <Text>Left-aligned text</Text>
            </LeftContainer>
            <RightContainer>
              <Text>Right-aligned text</Text>
              <Text>/</Text>
              <Text>Another right-aligned text</Text>
            </RightContainer>
          </Main>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
