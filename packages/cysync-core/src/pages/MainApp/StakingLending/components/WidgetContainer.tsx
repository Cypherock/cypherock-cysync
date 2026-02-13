import { Container, Flex, Typography } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

export interface WidgetContainerProps {
  selectedAccount: IAccount;
  webviewRef: React.RefObject<any>;
  widgetUrl?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  selectedAccount,
  webviewRef,
  widgetUrl = 'https://9716b016517de6f71e42f74b.p2p.org',
}) => {
  const [status, setStatus] = useState('Loading...');

  // Send address to main process when account changes
  useEffect(() => {
    console.log(
      '[WidgetContainer] Sending address to main process:',
      selectedAccount.xpubOrAddress,
    );

    window.electronAPI
      .setWidgetAddress(selectedAccount.xpubOrAddress)
      .then(() => {
        console.log('[WidgetContainer] Address sent successfully');
        setStatus(`Ready: ${selectedAccount.name}`);
      })
      .catch((error: Error) => {
        console.error('[WidgetContainer] Failed to send address:', error);
      });
  }, [selectedAccount]);

  // Auto-open webview DevTools
  // useEffect(() => {
  //   const webview = webviewRef.current;
  //   if (!webview) return () => undefined;

  //   const openDevTools = () => {
  //     console.log('[WidgetContainer] Opening webview DevTools');
  //     webview.openDevTools();
  //   };

  //   webview.addEventListener('dom-ready', openDevTools);

  //   return () => {
  //     webview.removeEventListener('dom-ready', openDevTools);
  //   };
  // }, [webviewRef]);

  return (
    <Container width="full" height="full">
      <Flex direction="column" height="full" width="full">
        <Container $bgColor="sideBar" px={4} py={2}>
          <Typography $fontSize={12} color="muted">
            {status}
          </Typography>
        </Container>

        <webview
          ref={webviewRef}
          src={widgetUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </Flex>
    </Container>
  );
};

WidgetContainer.defaultProps = {
  widgetUrl: 'https://9716b016517de6f71e42f74b.p2p.org',
};
