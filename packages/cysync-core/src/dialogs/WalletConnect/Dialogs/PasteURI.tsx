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
import React, { useEffect, useMemo, useState } from 'react';

import { WalletConnectConnectionState, useWalletConnect } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletConnectPasteURIDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { handleClose, createConnection, connectionState } = useWalletConnect();
  const { buttons, walletConnect } = lang.strings;
  const { uriTab } = walletConnect;
  const [walletConnectURI, setWalletConnectedURI] = useState('');
  const [error, setError] = useState('');
  const isLoading = useMemo(
    () => connectionState === WalletConnectConnectionState.CONNECTING,
    [connectionState],
  );
  const isDisabled = useMemo(
    () => isLoading || !walletConnectURI || walletConnectURI.length === 0,
    [walletConnectURI, isLoading],
  );

  const handleCopyFromClipboard = async (onlyWC?: boolean) => {
    const clipboardText = (await navigator.clipboard.readText()).trim();
    if (onlyWC && clipboardText.startsWith('wc:'))
      setWalletConnectedURI(clipboardText);
  };

  useEffect(() => {
    handleCopyFromClipboard(true);
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (isDisabled) return;

    if (!walletConnectURI.startsWith('wc')) {
      setError('Invalid URI');
      return;
    }
    setError('');
    createConnection(walletConnectURI);
  };

  return (
    <DialogBox width={500} align="stretch" gap={0} onClose={handleClose}>
      <form onSubmit={onSubmit}>
        <Flex direction="row" justify="flex-end" py={2} px={3}>
          <CloseButton onClick={handleClose} />
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
          <Flex direction="column" width="full" gap={4} pt={2} pb={4} px={5}>
            <Input
              pasteAllowed
              type="text"
              name="wallet-connect-uri"
              placeholder={uriTab.placeholder}
              label={uriTab.inputLabel}
              postfixIcon={<PasteIcon />}
              onPostfixIconClick={handleCopyFromClipboard}
              onChange={setWalletConnectedURI}
              value={walletConnectURI}
            />

            {error && (
              <Container display="block">
                <Typography
                  variant="h6"
                  color="error"
                  $fontWeight="light"
                  $textAlign="left"
                >
                  <LangDisplay text={error} />
                </Typography>
              </Container>
            )}
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            name="wallet-connect-uri"
            type="submit"
            variant="primary"
            disabled={isDisabled}
            isLoading={isLoading}
          >
            <LangDisplay text={buttons.connect} />
          </Button>
        </DialogBoxFooter>
      </form>
    </DialogBox>
  );
};
