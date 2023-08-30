import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Input,
  LangDisplay,
  Typography,
  WalletConnectLogo,
  Image,
  PasteIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useWalletConnectDialog } from '../context';

export const WalletConnectPasteURIDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onNext,
    onPasteWalletConnectedURI,
    walletConnectURI,
    setWalletConnectedURI,
  } = useWalletConnectDialog();
  const { buttons, walletConnect } = lang.strings;
  const { uriTab } = walletConnect;

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={4} py={4}>
          <Image src={WalletConnectLogo} alt="Send Coin" />
          <Container display="flex" direction="column" gap={2} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={uriTab.title} />
            </Typography>
            <Typography variant="span" color="muted">
              <LangDisplay text={uriTab.subTitle} />
            </Typography>
          </Container>
        </Container>
        <Input
          pasteAllowed
          type="text"
          name="wallet-connect-uri"
          placeholder={uriTab.placeholder}
          label={uriTab.inputLabel}
          postfixIcon={<Image src={PasteIcon} alt={uriTab.placeholder} />}
          onPostfixIconClick={onPasteWalletConnectedURI}
          onChange={setWalletConnectedURI}
          value={walletConnectURI}
        />
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={buttons.connect} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
