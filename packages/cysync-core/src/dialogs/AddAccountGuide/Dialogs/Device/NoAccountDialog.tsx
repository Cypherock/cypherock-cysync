import {
  LangDisplay,
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
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

const dataArray = [
  {
    id: '21',
    leftImageSrc: etheriumBlueIcon,
    rightText: '2.35 ETH',
    text: 'Ethereum 1',
  },
  {
    id: '22',
    leftImageSrc: etheriumBlueIcon,
    rightText: '0.77 ETH',
    text: 'Ethereum 2',
  },
  {
    id: '23',
    leftImageSrc: etheriumBlueIcon,
    rightText: '0.08 ETH',
    text: 'Ethereum 3',
  },
];

export const NoAccountDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const noAccount = lang.strings.addAccount.addAccount.noAccount.info.dialogBox;
  const button = lang.strings.buttons;
  const { onPrevious } = useAddAccountDialog();
  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={noAccount.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={loaderGrayIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={noAccount.header} />
        </Typography>
        <div>
          <InputLabel mt={4} mr={2} mb={1} display={{ def: 'inline-block' }}>
            {noAccount.subheader} ({dataArray.length})
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
        <Button
          variant="secondary"
          onClick={e => {
            e.preventDefault();
            onPrevious();
          }}
        >
          <LangDisplay text={noAccount.buttonSyncAgain} />
        </Button>
        <Button variant="primary">
          <LangDisplay text={button.close} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
