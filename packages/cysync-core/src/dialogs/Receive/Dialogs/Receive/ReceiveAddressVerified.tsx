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
  qrcodeIcon,
  InputLabel,
  CopyContainer,
} from '@cypherock/cysync-ui';
import React from 'react';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveAddressVerified: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceAddressVerified.info.dialogBox;
  const { goTo } = useReceiveDialog();
  const dispatch = useAppDispatch();

  const handleVerificationAgain = () => {
    goTo(1, 0);
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
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={connect.header} />
        </Typography>

        <Image src={qrcodeIcon} alt="qrcode image" />

        <Container
          display="flex"
          direction="column"
          width="full"
          gap={5}
          justify="flex-start"
        >
          <InputLabel my={0}>{connect.label}</InputLabel>
          <CopyContainer link={connect.address} />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={handleVerificationAgain}>
          {connect.buttonVerify}
        </Button>
        <Button
          variant="primary"
          onClick={() => dispatch(closeDialog('receiveDialog'))}
        >
          {connect.buttonDone}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
