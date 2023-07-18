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
  Divider,
  StretchedTypography,
  Flex,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../context';
import { styled } from 'styled-components';
import { addKeyboardEvents } from '~/hooks';

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
    justify-content: center;
    padding: 8px 8px;
    gap: 24px;
    align-self: stretch;
    align-items: flex-start;
  `;

  const LeftContainer = styled.div`
    display: flex;
    align-items: flex-start;
  `;

  const Icon = styled.img`
    width: 12px; /* Adjust the width of the icon as needed */
    height: 12px; /* Adjust the height of the icon as needed */
    margin-right: 5px;
  `;

  const RightContainer = styled.div`
    margin-left: auto;
    display: flex;
    align-items: flex-end;
  `;

  const Text = styled.span`
    margin-right: 15px;
    font-size: 12px;
    color: white;
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
              <Text>From</Text>
            </LeftContainer>
            <RightContainer>
              <Text>Cypherock Red</Text>
              <Text>/</Text>
              <Text>Another text</Text>
            </RightContainer>
          </Main>

          <Divider variant="horizontal" />
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
