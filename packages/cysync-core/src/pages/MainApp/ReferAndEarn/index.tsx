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
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
} from '@cypherock/cysync-ui';
import React, { FC, useRef } from 'react';

import { LoaderDialog } from '~/components';

import { MainAppLayout } from '../Layout';
import { useReferAndEarn } from '../hooks';

export const ReferAndEarn: FC = () => {
  const webviewRef = useRef(null);
  const {
    showLoader,
    canGoBack,
    handleHelp,
    lang,
    loadError,
    onBack,
    onRefresh,
    theme,
    webviewSrc,
  } = useReferAndEarn({ webviewRef });

  return (
    <MainAppLayout topbar={{ title: lang.strings.sidebar.referAndEarn }}>
      <Flex
        direction="column"
        $height="full"
        $width="full"
        $bgColor="contentGradient"
      >
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

          {(!loadError || showLoader) && (
            <webview
              id="referral-webview"
              src={webviewSrc}
              ref={webviewRef}
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

          {loadError && !showLoader && (
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
                <Button variant="secondary" onClick={handleHelp}>
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
