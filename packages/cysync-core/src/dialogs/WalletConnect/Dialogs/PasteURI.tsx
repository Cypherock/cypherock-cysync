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
  PasteIcon,
  CloseButton,
  Flex,
  Divider,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useWalletConnectDialog } from '../context';
import { WalletConnectConnectionState } from '~/context/walletConnect/type';

export interface WalletConnectPasteURIProps {
  error?: Error;
}

export const WalletConnectPasteURIDialog: React.FC<
  WalletConnectPasteURIProps
> = ({ error }) => {
  const lang = useAppSelector(selectLanguage);
  const {
    onConnect,
    connectionState,
    onPasteWalletConnectedURI,
    walletConnectURI,
    setWalletConnectedURI,
    isValidUri,
    onClose,
  } = useWalletConnectDialog();
  const { buttons, walletConnect } = lang.strings;
  const { uriTab } = walletConnect;

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} align="stretch">
        <Container
          display="flex"
          align="stretch"
          direction="column"
          gap={32}
          py={4}
          px={5}
        >
          <WalletConnectLogo $alignSelf="center" />
          <Container display="flex" direction="column" gap={2} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={uriTab.title} />
            </Typography>
            <Typography variant="span" color="muted">
              <LangDisplay text={uriTab.subTitle} />
            </Typography>
          </Container>
        </Container>
        <Container
          display="flex"
          align="stretch"
          direction="column"
          gap={4}
          pt={2}
          pb={4}
          px={5}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              onConnect();
            }}
            id="wallet-connect-uri-form"
          >
            <Input
              pasteAllowed
              type="text"
              name="wallet-connect-uri"
              placeholder={uriTab.placeholder}
              label={uriTab.inputLabel}
              postfixIcon={<PasteIcon />}
              onPostfixIconClick={onPasteWalletConnectedURI}
              onChange={setWalletConnectedURI}
              value={walletConnectURI}
              $customRightSpacing={40}
            />
          </form>
        </Container>
        {error && (
          <Container display="block">
            <Typography
              variant="h6"
              color="error"
              $fontWeight="light"
              $textAlign="center"
            >
              {`${error.name} - ${error.message}`}
            </Typography>
          </Container>
        )}
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          form="wallet-connect-uri-form"
          type="submit"
          variant="primary"
          disabled={
            !walletConnectURI || walletConnectURI.length === 0 || !isValidUri
          }
          isLoading={
            WalletConnectConnectionState.CONNECTING === connectionState
          }
        >
          <LangDisplay text={buttons.connect} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

WalletConnectPasteURIDialog.defaultProps = {
  error: undefined,
};
