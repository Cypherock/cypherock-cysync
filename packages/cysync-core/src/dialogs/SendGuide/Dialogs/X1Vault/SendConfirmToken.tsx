import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyAmountIcon,
  Typography,
  Image,
  Container,
  arrowGoldenForward,
  MessageBox,
  checkIcon,
  halfLoaderGold,
} from '@cypherock/cysync-ui';
import React from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../../context';

const dataArray = [
  {
    id: '1',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify',
    altText: 'Tether',
    rightImageSrc: checkIcon,
  },
  {
    id: '2',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify Recipient Address',
    rightImageSrc: checkIcon,
  },
  {
    id: '3',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify Amount:',
    altText: '0.0166864199 USDT',
    rightImageSrc: halfLoaderGold,
    animate: true,
  },
  {
    id: '4',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify fees:',
    altText: '0.00035448 ETH',
  },
  {
    id: '5',
    leftImageSrc: arrowGoldenForward,
    text: 'Enter passphrase',
  },
  {
    id: '6',
    leftImageSrc: arrowGoldenForward,
    text: 'Enter PIN and tap any one X1 Card',
  },
];
export const SendConfirmToken: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();
  const lang = useAppSelector(selectLanguage);
  const confirm = lang.strings.send.confirmToken.info.dialogBox;

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
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyAmountIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={confirm.header} />
          </Typography>
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              text={data.text}
              altText={data.altText}
              id={data.id}
              animate={data.animate}
            />
          ))}
        </LeanBoxContainer>

        <MessageBox type="info" text={confirm.infoBox.info} />

        <MessageBox type="warning" text={confirm.infoBox.warning} />
      </DialogBoxBody>
    </DialogBox>
  );
};
