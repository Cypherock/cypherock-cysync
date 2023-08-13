import {
  LangDisplay,
  DialogBox,
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
  Throbber,
} from '@cypherock/cysync-ui';
import { bitcoinIcon } from '@cypherock/cysync-ui/src';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveVerifyAddress: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceVerifyAddress.info.dialogBox;
  const { goTo, onPrevious } = useReceiveDialog();

  const dataArray = [
    {
      id: '2',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: 'Verify the address on X1 Vault exactly matches the address displayed above',
      rightImage: <Throbber size={15} strokeWidth={2} />,
    },
  ];

  const keyboardActions = {
    ArrowRight: () => {
      goTo(2, 2);
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  return (
    <DialogBox width={600}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={confirmIcon} alt="Verify Coin" />
        <Flex gap={5} direction="column">
          <Flex gap={8} direction="row">
            <Typography variant="h5" width="100%">
              <LangDisplay text={connect.text} />
            </Typography>
            <Image src={bitcoinIcon} alt="Bitcoin" />
            <Typography variant="h5" width="100%">
              <LangDisplay text={connect.coinText} />
            </Typography>

            <Tag $fontSize={12}>{connect.tag}</Tag>
          </Flex>
          <Typography variant="h5" width="100%" ml="auto" mr="auto">
            <LangDisplay text={connect.finaltext} />
          </Typography>
        </Flex>
        <Container
          display="flex"
          direction="column"
          width="full"
          gap={5}
          justify="flex-start"
        >
          <InputLabel mb={0}>{connect.label}</InputLabel>
          <CopyContainer link={connect.address} variant="gold" />
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImage={data.leftImage}
              text={data.text}
              id={data.id}
              px={6}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
