/* eslint-disable react/no-unknown-property */
import {
  ArrowBackGoldenIcon,
  Button,
  Flex,
  svgGradients,
  Synchronizing,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useRef, useState } from 'react';

import { LoaderDialog } from '~/components';
import { useBuySell } from '~/context';
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { selectLanguage, useAppSelector } from '~/store';

export const BuySellOrder = () => {
  const lang = useAppSelector(selectLanguage);
  const { isPreordering, preorderDetails, onPreviousState, onRetry } =
    useBuySell();
  const webviewRef = useRef<any>();
  const [showLoader, setShowLoader] = useState(true);

  const onRefresh = () => {
    analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_RETRY_ATTEMPT, {
      action: 'refresh_order',
    });
    webviewRef.current?.reload();
  };

  const onBack = () => {
    if (webviewRef.current?.canGoBack()) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_BACK_NAVIGATION, {
        fromStep: 'order',
        action: 'webview_back',
      });
      webviewRef.current.goBack();
    } else {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_BACK_NAVIGATION, {
        fromStep: 'order',
        toStep: 'account_selection',
      });
      onPreviousState();
    }
  };

  const onStartNavigation = (e: any) => {
    // TODO: fetch targetUrl from server as well?
    const targetUrl = 'https://www.cypherock.com';
    if (e?.url?.includes(targetUrl)) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_COMPLETED, {
        action: 'order_completed',
      });
      onRetry(true);
    } else {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_CANCELLED, {
        action: 'navigation_cancelled',
      });
    }
  };

  const onLoaded = () => {
    setShowLoader(false);
  };

  useEffect(() => {
    if (preorderDetails?.link) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_INITIATED, {
        action: 'order_initiated',
      });
    }

    const webview = document.getElementById('webviewid');
    if (webview) {
      webviewRef.current = webview;
      webview.addEventListener('did-start-navigation', onStartNavigation);
      webview.addEventListener('did-stop-loading', onLoaded);
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
              <Typography> {lang.strings.buttons.back} </Typography>
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
              <Typography> {lang.strings.buttons.retry} </Typography>
            </Flex>
          </Button>
        </Flex>
        {showLoader && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <LoaderDialog />
          </div>
        )}
        <webview
          id="webviewid"
          src={preorderDetails.link}
          style={{
            display: showLoader ? 'none' : 'inline-flex',
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
