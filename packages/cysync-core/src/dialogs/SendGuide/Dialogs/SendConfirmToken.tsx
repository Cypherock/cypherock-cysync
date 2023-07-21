import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyAmountIcon,
  Typography,
  Image,
  Container,
  arrowGoldenForward,
  checkIcon,
  halfLoaderGold,
  Info,
} from '@cypherock/cysync-ui';
import React from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../context';

const dataArray = [
  {
    id: '1',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify Tether',
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
    text: 'Verify Amount: 0.0166864199 USDT',
    rightImageSrc: halfLoaderGold,
    animate: true,
  },
  {
    id: '4',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify fees: 0.00035448 ETH',
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
  const lang = useAppSelector(selectLanguage);
  const initAccount =
    lang.strings.addAccount.addAccount.initAccount.info.dialogBox;
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
          <LangDisplay text={initAccount.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyAmountIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={initAccount.header} />
          </Typography>
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              text={data.text}
              id={data.id}
              animate={data.animate}
            />
          ))}
        </LeanBoxContainer>

        <Info
          showIcon
          iconVariant="white"
          textVariant="muted"
          text="Remember Tether is an Ethereum token therefore fee will be calculated in ETH (?)"
        />

        <Info
          showIcon
          iconVariant="yellow"
          textVariant="warn"
          text="Always verify the address displayed on your device exactly matches the address given by the recipient"
        />
      </DialogBoxBody>
    </DialogBox>
  );
};
