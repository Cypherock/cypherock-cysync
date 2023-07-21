// eslint-disable-next-line react/prop-types
import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  etheriumBlueIcon,
  Image,
  walletIcon,
  Button,
  ImageContainer,
  qrCodeIcon,
  Divider,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../context';
import { styled } from 'styled-components';
import { addKeyboardEvents } from '~/hooks';

const ParentContainer = styled.div`
  align-self: stretch;
  overflow-y: auto;
  max-height: 226px;
  border-radius: 8px;
  border: 1px solid #2d281f;
  background: #1b1812;
  padding-left: 16px;
  padding-right: 16px;
`;

export const Main = styled.div<{ top?: number }>`
  display: flex;
  justify-content: center;
  align-self: stretch;
  align-items: flex-start;
  margin: ${props => (props.top ? `${props.top}px 0` : '0')};
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RightContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NestedContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

export const SummaryScrollDialog: React.FC = () => {
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

  return (
    <DialogBox width={600}>
      <DialogBoxHeader height={56} width={600}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text="Send Crypto" />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text="Summary" />
        </Typography>

        <Main>
          <LeftContainer>
            <ImageContainer gap={8}>
              <Image
                src={walletIcon}
                alt="Left Image"
                width="15px"
                height="12px"
              />

              <Typography variant="p" color="muted" $fontSize={14}>
                From
              </Typography>
            </ImageContainer>
          </LeftContainer>
          <RightContainer>
            <Typography variant="p" $fontSize={14} color="muted">
              Cypherock Red
            </Typography>
            <Typography variant="p" $fontSize={14} color="muted">
              /
            </Typography>
            <ImageContainer gap={8}>
              <Image
                src={etheriumBlueIcon}
                alt="Left Image"
                width="11px"
                height="16px"
              />
              <Typography variant="p" $fontSize={14}>
                Ethereum 1
              </Typography>
            </ImageContainer>
          </RightContainer>
        </Main>

        <ParentContainer>
          <Main top={16}>
            <LeftContainer>
              <ImageContainer gap={8}>
                <Image
                  src={qrCodeIcon}
                  alt="Left Image"
                  width="11px"
                  height="20px"
                />
                <Typography variant="p" color="muted" $fontSize={14}>
                  To
                </Typography>
              </ImageContainer>
            </LeftContainer>
            <RightContainer>
              <Typography variant="p" $fontSize={14}>
                0xA4028f8dC64D18F0a66668d97473C47444A561Ea
              </Typography>
            </RightContainer>
          </Main>

          <Main top={24}>
            <LeftContainer>
              <Typography variant="p" color="muted" $fontSize={14}>
                Amount
              </Typography>
            </LeftContainer>
            <RightContainer>
              <NestedContainer>
                <Typography variant="p" $fontSize={14}>
                  0.016686419917276198 ETH
                </Typography>
                <Typography variant="p" $fontSize={14} color="muted">
                  $19.89
                </Typography>
              </NestedContainer>
            </RightContainer>
          </Main>

          <Divider variant="horizontal" />

          <Main top={24}>
            <LeftContainer>
              <ImageContainer gap={8}>
                <Image
                  src={qrCodeIcon}
                  alt="Left Image"
                  width="11px"
                  height="20px"
                />
                <Typography variant="p" color="muted" $fontSize={14}>
                  To
                </Typography>
              </ImageContainer>
            </LeftContainer>
            <RightContainer>
              <Typography variant="p" $fontSize={14}>
                0xA4028f8dC64D18F0a66668d97473C47444A561Ea
              </Typography>
            </RightContainer>
          </Main>
          <Main top={24}>
            <LeftContainer>
              <Typography variant="p" color="muted" $fontSize={14}>
                Amount
              </Typography>
            </LeftContainer>
            <RightContainer>
              <NestedContainer>
                <Typography variant="p" $fontSize={14}>
                  0.016686419917276198 ETH
                </Typography>
                <Typography variant="p" $fontSize={14} color="muted">
                  $19.89
                </Typography>
              </NestedContainer>
            </RightContainer>
          </Main>
        </ParentContainer>

        <Main>
          <LeftContainer>
            <Typography variant="p" $fontSize={14} color="muted">
              Network Fee
            </Typography>
          </LeftContainer>
          <RightContainer>
            <NestedContainer>
              <Typography variant="p" $fontSize={14}>
                0.00035448 ETH
              </Typography>
              <Typography variant="p" $fontSize={14} color="muted">
                $0.42
              </Typography>
            </NestedContainer>
          </RightContainer>
        </Main>

        <Divider variant="horizontal" />

        <Main>
          <LeftContainer>
            <Typography variant="p" color="muted" $fontSize={14}>
              Total to debit
            </Typography>
          </LeftContainer>
          <RightContainer>
            <NestedContainer>
              <Typography variant="p" $fontSize={14}>
                0.017040899917276198 ETH
              </Typography>
              <Typography variant="p" $fontSize={14} color="muted">
                $20.31
              </Typography>
            </NestedContainer>
          </RightContainer>
        </Main>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text="Back" />
        </Button>

        <Button variant="primary">
          <LangDisplay text="Continue" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
