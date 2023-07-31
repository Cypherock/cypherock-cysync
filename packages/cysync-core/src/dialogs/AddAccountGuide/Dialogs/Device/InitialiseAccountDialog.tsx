import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyCoinIcon,
  Typography,
  Image,
  Container,
  checkIcon,
  arrowGoldenForward,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

const dataArray = [
  {
    id: '1',
    leftImageSrc: arrowGoldenForward,
    text: 'Verify the coins on the device',
    rightImageSrc: checkIcon,
  },
  {
    id: '2',
    leftImageSrc: arrowGoldenForward,
    text: 'Enter passphrase',
    throbber: true,
  },
  {
    id: '3',
    leftImageSrc: arrowGoldenForward,
    text: 'Enter the PIN and tap any card',
  },
];
export const InitialiseAccountDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const initAccount =
    lang.strings.addAccount.addAccount.initAccount.info.dialogBox;
  const { goTo, onPrevious } = useAddAccountDialog();

  const keyboardActions = {
    ArrowRight: () => {
      goTo(1, 2);
    },
    ArrowUp: () => {
      goTo(1, 5);
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyCoinIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={initAccount.header} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={initAccount.subheader} />
            <strong style={{ color: 'white' }}>
              {' '}
              <LangDisplay text={initAccount.subheader1} />
            </strong>
          </Typography>
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              throbber={data.throbber}
              text={data.text}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
