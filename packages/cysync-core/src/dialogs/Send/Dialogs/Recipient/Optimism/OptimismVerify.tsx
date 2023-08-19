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
  Throbber,
  questionMarkGoldIcon,
  OptimismIcon,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { useSendDialog } from '../../../context';

const dataArray = [
  {
    id: '1',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Connect Device',
    rightImage: <Image src={checkIcon} alt="arrowGoldenForward icon" />,
  },
  {
    id: '2',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Verify',
    image: <OptimismIcon height={16} width={15} />,
    altText: 'Optimism',
    rightImage: <Image src={checkIcon} alt="arrowGoldenForward icon" />,
  },
  {
    id: '3',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Verify Recipient Address',
    rightImage: <Image src={checkIcon} alt="arrowGoldenForward icon" />,
  },
  {
    id: '4',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Verify Amount:',
    altText: '0.0166864199 ETH',
    rightImage: <Throbber size={15} strokeWidth={2} />,
  },
  {
    id: '5',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Verify fees(L2): 0.00035448 ETH',
  },
  {
    id: '6',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Enter passphrase',
  },
  {
    id: '7',
    leftImage: <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />,
    text: 'Enter PIN and tap any one X1 Card',
  },
];
export const OptimismVerify: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();
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
    <DialogBox width={500}>
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
              leftImage={data.leftImage}
              rightImage={data.rightImage}
              image={data.image}
              text={data.text}
              altText={data.altText}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
        <Container display="flex" direction="column" gap={16} width="full">
          <MessageBox
            type="info"
            textColor="white"
            text={confirm.infoBox.info.optimism.text}
            altText={confirm.infoBox.info.optimism.altText}
            rightImage={
              <Image src={questionMarkGoldIcon} alt="question mark icon" />
            }
          />

          <MessageBox type="warning" text={confirm.infoBox.warning} />
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
