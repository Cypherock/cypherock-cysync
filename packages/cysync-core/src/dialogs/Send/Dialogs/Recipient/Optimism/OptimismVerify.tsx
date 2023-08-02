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
import { useSendDialog } from '../../../context';

const dataArray = [
  {
    id: '1',
    leftImage: arrowGoldenForward,
    text: 'Connect Device',
    rightImage: checkIcon,
  },
  {
    id: '2',
    leftImage: arrowGoldenForward,
    text: 'Verify',
    altText: 'Optimism',
    rightImage: checkIcon,
  },
  {
    id: '3',
    leftImage: arrowGoldenForward,
    text: 'Verify Recipient Address',
    rightImage: checkIcon,
  },
  {
    id: '4',
    leftImage: arrowGoldenForward,
    text: 'Verify Amount:',
    altText: '0.0166864199 ETH',
    rightImage: halfLoaderGold,
    animate: true,
  },
  {
    id: '5',
    leftImage: arrowGoldenForward,
    text: 'Verify fees(L2): 0.00035448 ETH',
  },
  {
    id: '6',
    leftImage: arrowGoldenForward,
    text: 'Enter passphrase',
  },
  {
    id: '7',
    leftImage: arrowGoldenForward,
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
              text={data.text}
              altText={data.altText}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
        <Container display="flex" direction="column" gap={16} width="full">
          <MessageBox type="info" text={confirm.infoBox.info.optimism} />

          <MessageBox type="warning" text={confirm.infoBox.warning} />
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
