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
import { useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

export const NoAccountDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const noAccount = lang.addAccount.noAccount.info.dialogBox;
  const { onPrevious } = useAddAccountGuide();
  const dataArray = [
    {
      id: '21',
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
  return (
    <DialogBox width={500} height={544}>
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
            {noAccount.subheader} ({noAccount.dataArray.length})
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
            onPrevious?.();
          }}
        >
          Sync Again
        </Button>
        <Button variant="primary">Close</Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
