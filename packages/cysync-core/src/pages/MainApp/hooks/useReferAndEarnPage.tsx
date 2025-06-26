import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import { openContactSupportDialog } from '~/actions';
import { useAppSelector, selectLanguage, useAppDispatch } from '~/store';
import logger from '~/utils/logger';

const REFERRAL_URL = 'https://www.cypherock.com/affiliate';
const ALLOWED_URLS = [REFERRAL_URL];

const LOGIN_INDICATOR_SELECTOR = 'div.sld-ap-login';

const HEADER_ID_TO_HIDE = '_header-2-147';
const FOOTER_ID_TO_HIDE = 'code_block-17-147';
const REASONS_DIV_ID_TO_HIDE = 'div_block-4-114';
const STEPS_DIV_ID_TO_HIDE = 'div_block-7-114';
const WRITE_TO_US_DIV_ID_TO_HIDE = 'div_block-9-114';
const BECOME_AFFILIATE_DIV_ID_TO_HIDE = 'div_block-2-114';
const PURCHASE_NOTIFICATION_ID = 'purchase-notification';

const NETWORK_ERROR_CODES = [-2, -105, -106, -109, -118];

const HIDE_ELEMENTS_JS = (
  headerId: string,
  footerId: string,
  reasonsId: string,
  stepsId: string,
  writeToUsId: string,
  becomeAffiliateId: string,
  notificationId: string,
  loggedInSelector: string,
): string => `
  try {
    const headerElement = document.getElementById('${headerId}');
    const footerElement = document.getElementById('${footerId}');
    const reasonsElement = document.getElementById('${reasonsId}');
    const stepsElement = document.getElementById('${stepsId}');
    const writeToUsElement = document.getElementById('${writeToUsId}');
    const becomeAffiliateElement = document.getElementById('${becomeAffiliateId}');
    const notificationElement = document.getElementById('${notificationId}');
    const isLoggedIn = !!document.querySelector('${loggedInSelector}');
    console.log('[CySync Script] Login check executed. Logged In:', isLoggedIn);
    const alwaysHideStyle = 'display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important; border: none !important; position: absolute !important; top: -9999px !important; left: -9999px !important;';
    if (headerElement) headerElement.style.cssText = alwaysHideStyle;
    if (footerElement) footerElement.style.cssText = alwaysHideStyle;
    if (notificationElement) notificationElement.style.cssText = alwaysHideStyle;
    const conditionalHideStyle = 'display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important; border: none !important;';
    const showStyle = '';
    if (isLoggedIn) {
      if (reasonsElement) reasonsElement.style.cssText = conditionalHideStyle;
      if (stepsElement) stepsElement.style.cssText = conditionalHideStyle;
      if (writeToUsElement) writeToUsElement.style.cssText = conditionalHideStyle;
      if (becomeAffiliateElement) becomeAffiliateElement.style.cssText = conditionalHideStyle;
      console.log('[CySync Script] Conditional elements hidden (logged in).');
    } else {
      if (reasonsElement) reasonsElement.style.cssText = showStyle;
      if (stepsElement) stepsElement.style.cssText = showStyle;
      if (writeToUsElement) writeToUsElement.style.cssText = showStyle;
      if (becomeAffiliateElement) becomeAffiliateElement.style.cssText = showStyle;
      console.log('[CySync Script] Conditional elements shown (logged out).');
}} catch (e) {
    console.error('[CySync Script] Error executing visibility script:', e);
    throw e;
  }
`;

interface UseReferAndEarnProps {
  webviewRef: React.RefObject<any>;
}

export const useReferAndEarn = ({ webviewRef }: UseReferAndEarnProps) => {
  const lang = useAppSelector(selectLanguage);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [showLoader, setShowLoader] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webviewSrc, setWebviewSrc] = useState(REFERRAL_URL);
  const isMountedRef = useRef(true);

  const executeVisibilityScript = useCallback(() => {
    const webview = webviewRef.current;
    if (
      !webview ||
      typeof webview.getURL !== 'function' ||
      typeof webview.executeJavaScript !== 'function'
    ) {
      logger.warn('executeVisibilityScript: Webview or its methods not ready.');
      return;
    }

    const currentURL = webview.getURL();
    const isAllowed = ALLOWED_URLS.some(url => currentURL.startsWith(url));
    if (!isAllowed) {
      logger.info(
        `Skipping script injection on non-allowed URL: ${currentURL}`,
      );
      return;
    }

    const scriptToExecute = HIDE_ELEMENTS_JS(
      HEADER_ID_TO_HIDE,
      FOOTER_ID_TO_HIDE,
      REASONS_DIV_ID_TO_HIDE,
      STEPS_DIV_ID_TO_HIDE,
      WRITE_TO_US_DIV_ID_TO_HIDE,
      BECOME_AFFILIATE_DIV_ID_TO_HIDE,
      PURCHASE_NOTIFICATION_ID,
      LOGIN_INDICATOR_SELECTOR,
    );

    webview
      .executeJavaScript(scriptToExecute, true)
      .then(() => logger.debug(`Executed visibility script on ${currentURL}`))
      .catch((err: Error) =>
        logger.error('Failed to execute visibility script:', {
          error: err.message,
        }),
      );
  }, [webviewRef]);

  const handleNavigationStateChange = useCallback(() => {
    if (!isMountedRef.current || !webviewRef.current) return;
    const webview = webviewRef.current;

    const canGoBackLocal = webview.canGoBack();
    setCanGoBack(canGoBackLocal);

    const currentURL = webview.getURL();
    const isAllowed = ALLOWED_URLS.some(url => currentURL.startsWith(url));

    if (!isAllowed && canGoBackLocal) {
      logger.warn(`Navigated to a non-allowed URL: ${currentURL}. Going back.`);
      webview.goBack();
    }
  }, [webviewRef]);

  const handleDidStartLoading = useCallback(() => {
    if (!isMountedRef.current) return;
    logger.info('WebView event: did-start-loading.');
    setLoadError(null);
    setShowLoader(true);
    handleNavigationStateChange();
  }, [handleNavigationStateChange]);

  const handleDidStopLoading = useCallback(() => {
    if (!isMountedRef.current) return;
    logger.info('WebView event: did-stop-loading.');

    if (!loadError) {
      setShowLoader(false);
    }

    executeVisibilityScript();
    handleNavigationStateChange();
  }, [executeVisibilityScript, handleNavigationStateChange, loadError]);

  const handleDidFailLoad = useCallback((event: any) => {
    if (isMountedRef.current) {
      logger.error('WebView event: did-fail-load', {
        errorCode: event.errorCode,
        errorDescription: event.errorDescription,
        url: event.validatedURL,
        isMainFrame: event.isMainFrame,
      });
      if (event.validatedURL === 'about:blank' || event.errorCode === -3) {
        logger.warn(
          'Ignored benign did-fail-load event (e.g. about:blank, ABORTED).',
        );
        return;
      }
      if (NETWORK_ERROR_CODES.includes(event.errorCode) && event.isMainFrame) {
        setLoadError(
          event.errorDescription || 'Failed to load page due to network issue.',
        );
        logger.warn('Network-related error detected.');
      } else if (event.isMainFrame) {
        setLoadError(
          `Failed to load content (Code: ${event.errorCode}). ${
            event.errorDescription || 'Please try again.'
          }`,
        );
        logger.warn('Non-network error on main frame detected.');
      }
      setShowLoader(false);
    }
  }, []);

  const handleWillNavigate = useCallback(
    (event: { url: string }) => {
      const isAllowed = ALLOWED_URLS.some(url => event.url.startsWith(url));
      if (!isAllowed) {
        logger.warn(`Prevented navigation to non-allowed URL: ${event.url}`);
        const webview = webviewRef.current;
        if (webview) {
          webview.stop();
        }
      }
    },
    [webviewRef],
  );

  const onBack = () => {
    if (webviewRef.current?.canGoBack()) {
      logger.info('WebView Action: Go Back');
      webviewRef.current.goBack();
    } else {
      logger.warn('WebView cannot go back further.');
    }
  };

  const onRefresh = useCallback(() => {
    const webview = webviewRef.current;
    if (!webview) {
      logger.warn('onRefresh called but webviewRef is null.');
      return;
    }

    logger.info('WebView Action: Refresh requested by user.');
    setLoadError(null);
    setShowLoader(true);

    if (typeof webview.reloadIgnoringCache === 'function') {
      webview.reloadIgnoringCache();
    } else {
      setWebviewSrc('about:blank');
      requestAnimationFrame(() => {
        if (isMountedRef.current) {
          setWebviewSrc(REFERRAL_URL);
        }
      });
    }
  }, [webviewRef]);

  const handleHelp = () => {
    dispatch(openContactSupportDialog());
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) {
      return undefined;
    }

    logger.info('Webview element is ready. Attaching event listeners.');

    const handlers = {
      'did-start-loading': handleDidStartLoading,
      'did-stop-loading': handleDidStopLoading,
      'did-fail-load': handleDidFailLoad,
      'did-navigate': handleNavigationStateChange,
      'dom-ready': executeVisibilityScript,
      'will-navigate': handleWillNavigate,
    };

    Object.entries(handlers).forEach(([eventName, handler]) => {
      webview.addEventListener(eventName, handler);
    });

    return () => {
      if (webview) {
        logger.info('Cleaning up webview listeners.');
        Object.entries(handlers).forEach(([eventName, handler]) => {
          webview.removeEventListener(eventName, handler);
        });
      }
    };
  }, [
    webviewRef,
    handleDidStartLoading,
    handleDidStopLoading,
    handleDidFailLoad,
    handleNavigationStateChange,
    handleWillNavigate,
    executeVisibilityScript,
  ]);

  return {
    showLoader,
    canGoBack,
    loadError,
    webviewSrc,
    onBack,
    onRefresh,
    lang,
    theme,
    handleHelp,
  };
};
