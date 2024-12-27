/* eslint-disable react/no-unknown-property */
import {
  ArrowBackGoldenIcon,
  Button,
  Flex,
  svgGradients,
  Synchronizing,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useRef } from 'react';

import { LoaderDialog } from '~/components';
import { useBuySell } from '~/context';

export const BuySellOrder = () => {
  const { isPreordering, preorderDetails, onPreviousState, onRetry } =
    useBuySell();
  const webviewRef = useRef<any>();

  const onRefresh = () => {
    webviewRef.current?.reload();
  };

  const onBack = () => {
    if (webviewRef.current?.canGoBack()) {
      webviewRef.current.goBack();
    } else {
      onPreviousState();
    }
  };

  const onStartNavigation = (e: any) => {
    // TODO: fetch targetUrl from server as well?
    const targetUrl = 'https://www.cypherock.com';
    if (e?.url?.includes(targetUrl)) {
      onRetry(true);
    }
  };

  useEffect(() => {
    const webview = document.getElementById('webviewid');
    if (webview) {
      webviewRef.current = webview;
      webview.addEventListener('did-start-navigation', onStartNavigation);
    }
  }, [preorderDetails]);

  if (!isPreordering && preorderDetails?.link)
    return (
      <Flex direction="column" $height="full" $width="full">
        <Flex
          height={58}
          width="100%"
          direction="row"
          px={3}
          py={1}
          gap={32}
          $bgColor="sideBar"
        >
          <Button variant="none" onClick={onBack}>
            <Flex
              direction="row"
              gap={16}
              justify="center"
              align="center"
              px={2}
              $height="full"
            >
              <ArrowBackGoldenIcon width={12} height={12} />
              <Typography> Back </Typography>
            </Flex>
          </Button>
          <Button variant="none" onClick={onRefresh}>
            <Flex
              direction="row"
              gap={16}
              justify="center"
              align="center"
              px={2}
              $height="full"
            >
              <Synchronizing
                width={12}
                height={12}
                fill={`url(#${svgGradients.gold})`}
              />
              <Typography> Retry </Typography>
            </Flex>
          </Button>
        </Flex>
        <webview
          id="webviewid"
          src={preorderDetails.link}
          style={{
            display: 'inline-flex',
            height: '100%',
            width: '100%',
            padding: '20px',
          }}
          webpreferences="nativeWindowOpen=true"
          // @ts-expect-error Popups won't work without this line and it doesn't work when we pass a boolean
          allowpopups="true"
        />
      </Flex>
    );

  return <LoaderDialog />;
};
