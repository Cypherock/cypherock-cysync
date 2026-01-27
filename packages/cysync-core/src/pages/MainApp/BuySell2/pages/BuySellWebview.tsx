import { Flex } from '@cypherock/cysync-ui';
import React, { useRef, useEffect } from 'react';

import { useBuySell2 } from '~/context/buySell2';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';

import { BuySellPage } from '.';

export const BuySellWebview = () => {
  const { order, reset, toPage, setNavigationOptions } = useBuySell2();

  // eslint-disable-next-line no-null/no-null, @typescript-eslint/no-explicit-any
  const webviewRef = useRef<any>(null);

  useEffect(() => {
    const webview = webviewRef.current;

    const onRefresh = () => {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_RETRY_ATTEMPT, {
        action: 'refresh_order',
      });
      if (webview) {
        webview.reload();
      }
    };

    const onBack = () => {
      if (webview?.canGoBack()) {
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_BACK_NAVIGATION,
          {
            fromStep: 'order',
            action: 'webview_back',
          },
        );
        webview.goBack();
      } else {
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_BACK_NAVIGATION,
          {
            fromStep: 'order',
            toStep: 'input',
          },
        );
        toPage(BuySellPage.Input);
      }
    };

    setNavigationOptions({ onBack, onRefresh });

    return () => {
      setNavigationOptions({});
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onStartNavigation = (e: any) => {
    // TODO: fetch targetUrl from server as well?
    const targetUrl = 'https://www.cypherock.com';
    if (e?.url?.includes(targetUrl)) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_COMPLETED, {
        action: 'order_completed',
      });
      reset();
    } else {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_CANCELLED, {
        action: 'navigation_cancelled',
      });
    }
  };

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      webview.addEventListener('did-start-navigation', onStartNavigation);
    }

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener(
          'did-start-navigation',
          onStartNavigation,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (order.current?.redirectUrl) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_INITIATED, {
        action: 'order_initiated',
      });
    }
  }, [order.current?.redirectUrl]);

  return (
    <Flex
      direction="column"
      $height="full"
      $width="full"
      align="center"
      justify="center"
    >
      {order.current?.redirectUrl && (
        <webview
          src={order.current.redirectUrl}
          style={{
            height: '100%',
            width: '100%',
          }}
          ref={webviewRef}
          // eslint-disable-next-line react/no-unknown-property
          webpreferences="nativeWindowOpen=true"
          // @ts-expect-error Popups won't work without this line and it doesn't work when we pass a boolean
          // eslint-disable-next-line react/no-unknown-property
          allowpopups="true"
        />
      )}
    </Flex>
  );
};
