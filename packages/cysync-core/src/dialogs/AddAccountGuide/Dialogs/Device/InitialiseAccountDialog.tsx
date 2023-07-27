import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyCoinIcon,
  Typography,
  Image,
  Container,
  checkIcon,
  halfLoaderGold,
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
    text: 'Verify the coins on the X1 Vault',
    rightImageSrc: checkIcon,
  },
  {
    id: '2',
    leftImageSrc: arrowGoldenForward,
    text: 'Enter passphrase',
    rightImageSrc: halfLoaderGold,
    animate: true,
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
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={initAccount.title} />
        </Typography>
      </DialogBoxHeader>
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
              text={data.text}
              id={data.id}
              animate={data.animate}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
