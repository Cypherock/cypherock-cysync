import {
  LangDisplay,
  DialogBox,
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

import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveAddressVerified: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceAddressVerified.info.dialogBox;
  const { buttons } = lang.strings;
  const { goTo, onClose } = useReceiveDialog();

  const handleVerificationAgain = () => {
    goTo(1, 0);
  };

  return (
    <DialogBox width={600}>
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
          <CopyContainer link={connect.address} variant="gold" />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={handleVerificationAgain}>
          {buttons.reverify}
        </Button>
        <Button variant="primary" onClick={onClose}>
          {buttons.done}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
