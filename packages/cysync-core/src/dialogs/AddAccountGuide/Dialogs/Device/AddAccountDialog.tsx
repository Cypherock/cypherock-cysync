import {
  LangDisplay,
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
  settingsIcon,
  bnbChainIcon,
  etheriumBlueIcon,
  bitcoinIcon,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

export const AddAccountDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);

  const { title, header, subheader, submitButton, advanced } =
    lang.addAccount.add.info.dialogBox;

  const { onNext } = useAddAccountGuide();
  const dataArray = [
    {
      id: '31', // Add a unique identifier to each data object
      leftImageSrc: bnbChainIcon,
      // rightText: '2.35 ETH',
      text: 'BNB Chain 1',
      checkBox: true,
    },
    {
      id: '32',
      leftImageSrc: bitcoinIcon,
      // rightText: '0.77 ETH',
      text: 'Bitcoin 1',
      checkBox: true,
      tag: 'TAPROOT',
    },
    {
      id: '33',
      leftImageSrc: etheriumBlueIcon,
      // rightText: '0.08 ETH',
      text: 'Etherium 3',
      checkBox: true,
    },
  ];

  return (
    <DialogBox width={500} height={544}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={header} />
        </Typography>
        <div>
          <InputLabel
            mt={4}
            mr={2}
            mb={1}
            display={{ def: 'inline-block' }}
            fontSize={14}
          >
            <LangDisplay text={subheader} />
          </InputLabel>
          <LeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                text={data.text}
                color="heading"
                textVariant="fineprint"
                tag={data.tag}
                checkBox={data.checkBox}
                id={data.id}
              />
            ))}
          </LeanBoxContainer>
          <InputLabel
            fontSize={13}
            fontWeight="normal"
            textAlign="right"
            mt={1}
            display={{ def: 'inline-block' }}
            color="gold"
          >
            <LangDisplay text={advanced} />
          </InputLabel>
        </div>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button onClick={() => onNext()} variant="primary">
          <LangDisplay text={submitButton} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
