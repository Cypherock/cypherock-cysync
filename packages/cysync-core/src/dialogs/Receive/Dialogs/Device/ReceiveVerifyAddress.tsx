import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  arrowGoldenForward,
  confirmIcon,
  LeanBoxContainer,
  LeanBox,
  CopyContainer,
  InputLabel,
  Flex,
  Tag,
} from '@cypherock/cysync-ui';
import { bitcoinIcon, spinnerGoldIcon } from '@cypherock/cysync-ui/src';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveGuide } from '../../context';

export const ReceiveVerifyAddress: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceVerifyAddress.info.dialogBox;
  const { onNext, onPrevious } = useReceiveGuide();

  const dataArray = [
    {
      id: '2',
      leftImageSrc: arrowGoldenForward,

      text: 'Verify the address on X1 Vault exactly matches the address displayed above',
      rightImageSrc: spinnerGoldIcon,
      animate: true,
    },
  ];

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
          <LangDisplay text={connect.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={confirmIcon} alt="Verify Coin" />
        <Flex gap={5} direction="column">
          <Flex gap={5} direction="row">
            <Typography variant="h5" width="100%">
              <LangDisplay text="Address for " />
            </Typography>
            <Image src={bitcoinIcon} alt="Bitcoin" />
            <Typography variant="h5" width="100%">
              <LangDisplay text=" Bitcoin 1 " />
            </Typography>

            <Tag mt={5} $fontSize={12}>
              NATIVE SEGWIT
            </Tag>
          </Flex>
          <Typography variant="h5" width="100%" ml={8}>
            <LangDisplay text=" in Cypherock Red" />
          </Typography>
        </Flex>
        <Container
          display="flex"
          direction="column"
          width="full"
          gap={5}
          justify="flex-start"
        >
          <InputLabel>{connect.label}</InputLabel>
          <CopyContainer link={connect.address} />
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
              py={4}
              mt={4}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
