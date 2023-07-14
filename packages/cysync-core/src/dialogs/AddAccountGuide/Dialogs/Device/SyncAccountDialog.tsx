import {
  loaderGrayIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
  LangDisplay,
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useAppSelector } from '~/store';

import { useAddAccountGuide } from '../../context';
import { addKeyboardEvents } from '~/hooks';

export const SyncAccountDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const sync = lang.addAccount.syncAccount.info.dialogBox;
  const { onNext, onPrevious } = useAddAccountGuide();

  const keyboardActions = {
    ArrowRight: () => {
      onNext(1, 4);
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const dataArray = [
    {
      id: '21', // Add a unique identifier to each data object
      leftImageSrc: etheriumBlueIcon,
      rightText: '2.35 ETH',
      text: 'Etherium 1',
    },
    {
      id: '22',
      leftImageSrc: etheriumBlueIcon,
      rightText: '0.77 ETH',
      text: 'Etherium 2',
    },
    {
      id: '23',
      leftImageSrc: etheriumBlueIcon,
      rightText: '0.08 ETH',
      text: 'Etherium 3',
    },
  ];

  const handleNextWithTimeout = () => {
    onNext();
  };

  return (
    <DialogBox width={500} height={544}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={sync.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={loaderGrayIcon} alt="Loader" animate="spin" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={sync.header} />
        </Typography>
        <div>
          <InputLabel mt={4} mr={2} mb={1} display={{ def: 'inline-block' }}>
            {sync.subheader} ({sync.dataArray.length})
          </InputLabel>
          <LeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                rightText={data.rightText}
                text={data.text}
                color="heading"
                textVariant="fineprint"
                rightTextVariant="fineprint"
                rightTextColor="muted"
              />
            ))}
          </LeanBoxContainer>
        </div>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={handleNextWithTimeout}>
          <LangDisplay text={sync.end} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
