import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  DialogBoxFooter,
  Button,
  circledCheckIcon,
  InputLabel,
  CopyContainer,
  Flex,
  bitcoinIcon,
  Tag,
  qrcodeIcon,
  InformationBox,
  informationOrangeIcon,
} from '@cypherock/cysync-ui';
import React from 'react';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { useReceiveGuide } from '../../context';

export const ReceiveAddressNotVerified: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const connect = lang.strings.receive.deviceAddressNotVerified.info.dialogBox;

  const dispatch = useAppDispatch();
  const { onNext } = useReceiveGuide();

  const handleVerificationAgain = () => {
    onNext(1, 0);
  };

  return (
    <DialogBox width={600}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={connect.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={circledCheckIcon} alt="Connection Disconnected" />
        <Flex gap={5} direction="column">
          <Flex gap={5} direction="row">
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
        <Image src={qrcodeIcon} alt="qrcode image" />
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
        <InformationBox
          text={connect.InfoBox.text}
          imagePath={informationOrangeIcon}
          backgroundColor="infoBackground"
          borderColor="infoBoxOrange"
        />
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={handleVerificationAgain}>
          {connect.buttonVerify}
        </Button>
        <Button
          variant="primary"
          onClick={() => dispatch(closeDialog('receiveGuide'))}
        >
          {connect.buttonDone}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
