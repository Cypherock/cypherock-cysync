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
import { useWalletConnectDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletConnectPasteURIDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onNext,
    onPasteWalletConnectedURI,
    walletConnectURI,
    setWalletConnectedURI,
  } = useWalletConnectDialog();
  const { buttons } = lang.strings;

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={4} py={4}>
          <Image src={WalletConnectLogo} alt="Send Coin" />
          <Container display="flex" direction="column" gap={2} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text="WalletConnect" />
            </Typography>
            <Typography variant="span" color="muted">
              <LangDisplay text="Enter WalletConnect URI to connect with the DApp" />
            </Typography>
          </Container>
        </Container>
        <Input
          pasteAllowed
          type="text"
          name="wallet-connect-uri"
          placeholder="Paste URI"
          label="Enter connection URI"
          postfixIcon={<Image src={PasteIcon} alt="Paste URI" />}
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
