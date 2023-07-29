import {
  LangDisplay,
  loaderGrayIcon,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
  etheriumBlueIcon,
  FlexGapContainer,
  Container,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';
import { useCloseDialogBox } from '~/hooks';

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
  const closeDialogBox = useCloseDialogBox();

  return (
    <DialogBox width={500}>
      <FlexGapContainer pt={4} pr={5} pl={5}>
        <Image src={loaderGrayIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={noAccount.header} />
        </Typography>
      </FlexGapContainer>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5} align="flex-start">
        <Container display="flex" direction="column" gap={5} width="full">
          <InputLabel>
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
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          onClick={e => {
            e.preventDefault();
            onPrevious();
          }}
        >
          <LangDisplay text={button.resync} />
        </Button>
        <Button
          variant="primary"
          onClick={() => closeDialogBox('addAccountDialog')}
        >
          <LangDisplay text={button.close} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
