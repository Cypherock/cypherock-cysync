/* eslint-disable react/no-unknown-property */
import {
  ArrowBackGoldenIcon,
  Button,
  Container,
  FailIcon,
  Flex,
  LangDisplay,
  svgGradients,
  Synchronizing,
  Typography,
  useTheme,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useRef, useState, useCallback } from 'react';

import { LoaderDialog } from '~/components';
import { openContactSupportDialog } from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { MainAppLayout } from '../Layout';

const REFERRAL_URL = 'https://www.cypherock.com/affiliate';

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
    }
  } catch (e) {
    console.error('[CySync Script] Error executing visibility script:', e);
  }
  true;
`;

export const ReferAndEarn: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const webviewRef = useRef<any>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webviewSrc, setWebviewSrc] = useState(REFERRAL_URL); // State for webview src
  const isMountedRef = useRef(true);
  const listenersAttachedRef = useRef(false);
  const domReadyFiredRef = useRef(false);

  const executeConditionalHideScript = useCallback(() => {
    if (webviewRef.current?.executeJavaScript) {
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
      webviewRef.current
        .executeJavaScript(scriptToExecute, true)
        .then(() => logger.debug('Executed visibility script.'))
        .catch((err: Error) =>
          logger.error('Failed to execute visibility script:', {
            error: err.message,
          }),
        );
    } else {
      logger.warn(
        'Attempted to execute script, but webviewRef or executeJavaScript is not available.',
      );
    }
  }, []);

  const handleDidStartLoading = useCallback(() => {
    if (isMountedRef.current) {
      logger.info('WebView event: did-start-loading.', {
        url: webviewRef.current?.getURL(),
      });
      setLoadError(null);
      setShowLoader(true);
      setCanGoBack(webviewRef.current?.canGoBack() ?? false);
    }
  }, []);

  const handleDidStopLoading = useCallback(() => {
    if (isMountedRef.current) {
      logger.info('WebView event: did-stop-loading.', {
        url: webviewRef.current?.getURL(),
      });
      if (webviewRef.current?.getURL() !== 'about:blank') {
        setLoadError(null);
      }
      executeConditionalHideScript();
      setShowLoader(false);
      setCanGoBack(webviewRef.current?.canGoBack() ?? false);
    }
  }, [executeConditionalHideScript]);

  const handleDidNavigate = useCallback(() => {
    if (isMountedRef.current) {
      logger.debug('WebView event: did-navigate');
      if (
        webviewRef.current?.getURL() !== 'about:blank' &&
        !webviewRef.current?.isLoading()
      ) {
        setLoadError(null);
      }
      executeConditionalHideScript();
      setCanGoBack(webviewRef.current?.canGoBack() ?? false);
    }
  }, [executeConditionalHideScript]);

  const handleDidFailLoad = useCallback((event: any) => {
    if (isMountedRef.current) {
      logger.error('WebView event: did-fail-load', {
        errorCode: event.errorCode,
        errorDescription: event.errorDescription,
        url: event.validatedURL,
        isMainFrame: event.isMainFrame,
      });
      if (event.validatedURL === 'about:blank') {
        logger.warn(
          'Ignored did-fail-load for about:blank navigation during retry.',
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

  const attachMainListeners = useCallback(() => {
    if (
      !webviewRef.current ||
      listenersAttachedRef.current ||
      !isMountedRef.current
    )
      return;
    logger.info('Attaching main WebView listeners');
    if (typeof webviewRef.current.addEventListener !== 'function') {
      logger.error('Webview object does not have addEventListener method.');
      return;
    }
    webviewRef.current.removeEventListener(
      'did-start-loading',
      handleDidStartLoading,
    );
    webviewRef.current.removeEventListener(
      'did-stop-loading',
      handleDidStopLoading,
    );
    webviewRef.current.removeEventListener('did-navigate', handleDidNavigate);
    webviewRef.current.removeEventListener('did-fail-load', handleDidFailLoad);

    webviewRef.current.addEventListener(
      'did-start-loading',
      handleDidStartLoading,
    );
    webviewRef.current.addEventListener(
      'did-stop-loading',
      handleDidStopLoading,
    );
    webviewRef.current.addEventListener('did-navigate', handleDidNavigate);
    webviewRef.current.addEventListener('did-fail-load', handleDidFailLoad);
    listenersAttachedRef.current = true;
  }, [
    handleDidStartLoading,
    handleDidStopLoading,
    handleDidNavigate,
    handleDidFailLoad,
  ]);

  const handleDomReady = useCallback(() => {
    if (
      !isMountedRef.current ||
      domReadyFiredRef.current ||
      !webviewRef.current
    )
      return;

    domReadyFiredRef.current = true;
    logger.info('WebView event: dom-ready');
    executeConditionalHideScript();
    attachMainListeners();

    try {
      if (!webviewRef.current.isLoading()) {
        logger.info('WebView dom-ready: Already stopped loading.');
        handleDidStopLoading();
      } else {
        logger.info('WebView dom-ready: Still loading.');
        handleDidStartLoading();
      }
    } catch (error) {
      logger.error(`Error checking isLoading after dom-ready`, {
        error: error instanceof Error ? error.message : String(error),
      });
      if (isMountedRef.current) setShowLoader(false);
    }
  }, [
    executeConditionalHideScript,
    attachMainListeners,
    handleDidStartLoading,
    handleDidStopLoading,
  ]);

  const onBack = () => {
    if (webviewRef.current?.canGoBack()) {
      logger.info('WebView Action: Go Back');
      webviewRef.current.goBack();
    } else {
      logger.warn('WebView cannot go back further.');
    }
  };

  const onRefresh = () => {
    if (webviewRef.current) {
      logger.info('WebView Action: Refresh requested by user.');
      setLoadError(null);
      setShowLoader(true);
      listenersAttachedRef.current = false; // Reset to allow re-attaching listeners
      domReadyFiredRef.current = false; // Reset to allow dom-ready logic to re-run

      try {
        logger.info(
          'Attempting forceful reset: setting src to about:blank then back to REFERRAL_URL',
        );
        setWebviewSrc('about:blank'); // Trigger re-render with blank

        setTimeout(() => {
          if (isMountedRef.current) {
            setWebviewSrc(REFERRAL_URL); // Trigger re-render with original URL
          }
        }, 50); // Short delay
      } catch (e) {
        logger.error('Error during onRefresh forceful reset:', {
          error: e instanceof Error ? e.message : String(e),
        });
        if (isMountedRef.current) {
          setLoadError('Failed to initiate refresh process.');
          setShowLoader(false);
        }
      }
    } else {
      logger.warn('onRefresh called but webviewRef is null.');
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    listenersAttachedRef.current = false; // Reset on each effect run related to webviewSrc
    domReadyFiredRef.current = false; // Reset on each effect run related to webviewSrc
    let webview: any | null = null;

    const findAndSetupWebview = () => {
      if (!isMountedRef.current) return;
      webview = document.getElementById('referral-webview');

      if (webview) {
        webviewRef.current = webview; // Set ref immediately
        logger.info(
          'Referral WebView Element found/re-found due to src change.',
        );

        // Clean up potential old listeners before adding new ones
        webview.removeEventListener('dom-ready', handleDomReady);
        webview.removeEventListener('did-start-loading', handleDidStartLoading);
        webview.removeEventListener('did-stop-loading', handleDidStopLoading);
        webview.removeEventListener('did-navigate', handleDidNavigate);
        webview.removeEventListener('did-fail-load', handleDidFailLoad);

        webview.addEventListener('dom-ready', handleDomReady, { once: true });
        logger.info('Attached dom-ready listener.');
        // Main listeners are attached by handleDomReady or the edge case check below

        try {
          if (typeof webview.getURL === 'function') {
            // Ensure method exists
            logger.info('Webview has getURL method.');
            if (!domReadyFiredRef.current) {
              // Only if dom-ready hasn't already handled it
              logger.warn(
                'Webview seems ready before dom-ready event (or src changed), checking loading state and attaching main listeners.',
              );
              attachMainListeners(); // Attach main listeners
              if (!webview.isLoading()) {
                handleDidStopLoading();
              } else {
                handleDidStartLoading();
              }
            }
          } else {
            logger.warn('Webview getURL method not found on initial check.');
            if (isMountedRef.current && !showLoader) setShowLoader(true); // Default to loading
          }
        } catch (error: unknown) {
          logger.error(
            `Error during initial webview state check in useEffect`,
            { error: error instanceof Error ? error.message : String(error) },
          );
          if (isMountedRef.current) setShowLoader(true); // Default to loading
        }
      } else {
        logger.error('Referral WebView Element could not be found.');
        if (isMountedRef.current) {
          setShowLoader(false);
          setLoadError('Webview element could not be found.');
        }
      }
    };

    const rafId = requestAnimationFrame(findAndSetupWebview);

    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(rafId);
      logger.info(
        'Cleaning up WebView listeners for Referral page (useEffect).',
      );
      const currentWebview = webviewRef.current;
      if (currentWebview) {
        currentWebview.removeEventListener('dom-ready', handleDomReady);
        currentWebview.removeEventListener(
          'did-start-loading',
          handleDidStartLoading,
        );
        currentWebview.removeEventListener(
          'did-stop-loading',
          handleDidStopLoading,
        );
        currentWebview.removeEventListener('did-navigate', handleDidNavigate);
        currentWebview.removeEventListener('did-fail-load', handleDidFailLoad);
        logger.info('WebView listeners removed (useEffect cleanup).');
      }
      webviewRef.current = null;
    };
  }, [
    webviewSrc,
    handleDomReady,
    handleDidStartLoading,
    handleDidStopLoading,
    handleDidNavigate,
    handleDidFailLoad,
    attachMainListeners,
  ]);

  return (
    <MainAppLayout topbar={{ title: lang.strings.sidebar.referAndEarn }}>
      <Flex
        direction="column"
        $height="full"
        $width="full"
        $bgColor="contentGradient"
      >
        {/* Custom Navigation Bar */}
        <Flex
          height={58}
          width="100%"
          direction="row"
          px={3}
          py={1}
          gap={32}
          $bgColor="sideBar"
          align="center"
          shrink={0}
        >
          <Button
            variant="none"
            onClick={onBack}
            disabled={!canGoBack || showLoader || !!loadError}
          >
            <Flex
              direction="row"
              gap={16}
              justify="center"
              align="center"
              px={2}
              $height="full"
              opacity={!canGoBack || showLoader || !!loadError ? 0.5 : 1}
              $cursor={
                !canGoBack || showLoader || !!loadError
                  ? 'not-allowed'
                  : 'pointer'
              }
            >
              <ArrowBackGoldenIcon width={12} height={12} />
              <Typography
                color={
                  !canGoBack || showLoader || !!loadError ? 'muted' : undefined
                }
              >
                <LangDisplay text={lang.strings.buttons.back} />
              </Typography>
            </Flex>
          </Button>
          <Button
            variant="none"
            onClick={onRefresh}
            disabled={showLoader && !loadError}
          >
            <Flex
              direction="row"
              gap={16}
              justify="center"
              align="center"
              px={2}
              $height="full"
              opacity={showLoader && !loadError ? 0.5 : 1}
              $cursor={showLoader && !loadError ? 'not-allowed' : 'pointer'}
            >
              <Synchronizing
                width={12}
                height={12}
                fill={`url(#${svgGradients.gold})`}
              />
              <Typography>
                <LangDisplay text={lang.strings.buttons.retry} />
              </Typography>
            </Flex>
          </Button>
        </Flex>

        <Flex
          $flex={1}
          position="relative"
          align="center"
          justify="center"
          $overflow="hidden"
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: showLoader ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              backgroundColor:
                theme?.palette?.background?.content ?? 'rgba(22, 18, 15, 0.9)',
              transition: 'opacity 0.3s ease-out',
              opacity: showLoader ? 1 : 0,
            }}
          >
            <LoaderDialog />
          </div>

          {(!loadError || showLoader) && ( // Render webview if no error OR if loading (even if there was a previous error)
            <webview
              id="referral-webview"
              src={webviewSrc} // Use state for src
              style={{
                display: 'inline-flex',
                flexGrow: 1,
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor:
                  theme?.palette?.background?.content ?? '#16120F',
                visibility: showLoader || loadError ? 'hidden' : 'visible',
              }}
              webpreferences="nativeWindowOpen=true"
              // @ts-expect-error allowpopups is valid for Electron webview
              allowpopups="true"
            />
          )}

          {loadError &&
            !showLoader && ( // Show error only if NOT loading
              <DialogBox width={500} $zIndex={2}>
                <DialogBoxBody py={4} px={5} gap={32}>
                  <FailIcon />
                  <Container display="flex" direction="column" gap={4}>
                    <Typography variant="h5" $textAlign="center">
                      {`${lang.strings.errors.serverErrors.SER_0001.heading} (SER_0001)`}
                    </Typography>
                    <Typography variant="p" $textAlign="center" color="muted">
                      {loadError}
                    </Typography>
                  </Container>
                </DialogBoxBody>
                <DialogBoxFooter>
                  <Button
                    variant="secondary"
                    onClick={() => dispatch(openContactSupportDialog())}
                  >
                    {lang.strings.buttons.help}
                  </Button>
                  <Button variant="primary" onClick={onRefresh}>
                    {lang.strings.buttons.retry}
                  </Button>
                </DialogBoxFooter>
              </DialogBox>
            )}
        </Flex>
      </Flex>
    </MainAppLayout>
  );
};
