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

import { useReferAndEarn } from '../hooks';
import { MainAppLayout } from '../Layout';

const TopBar: FC<{
  canGoBack: boolean;
  showLoader: boolean;
  loadError: string | null;
  onBack: () => void;
  onRefresh: () => void;
  lang: any;
}> = ({ canGoBack, showLoader, loadError, onBack, onRefresh, lang }) => (
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
          !canGoBack || showLoader || !!loadError ? 'not-allowed' : 'pointer'
        }
      >
        <ArrowBackGoldenIcon width={12} height={12} />
        <Typography
          color={!canGoBack || showLoader || !!loadError ? 'muted' : undefined}
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
);

const LoaderOverlay: FC<{ show: boolean; theme: any }> = ({ show, theme }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: show ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      backgroundColor:
        theme?.palette?.background?.content ?? 'rgba(22, 18, 15, 0.9)',
      transition: 'opacity 0.3s ease-out',
      opacity: show ? 1 : 0,
    }}
  >
    <LoaderDialog />
  </div>
);

const WebviewSection: FC<{
  showLoader: boolean;
  loadError: string | null;
  webviewSrc: string;
  webviewRef: React.RefObject<any>;
  theme: any;
}> = ({ showLoader, loadError, webviewSrc, webviewRef, theme }) =>
  !loadError || showLoader ? (
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
        backgroundColor: theme?.palette?.background?.content ?? '#16120F',
        visibility: showLoader || loadError ? 'hidden' : 'visible',
      }}
      webpreferences="nativeWindowOpen=true"
      // @ts-expect-error allowpopups is valid for Electron webview
      allowpopups="true"
    />
  ) : null;

const ErrorDialog: FC<{
  loadError: string | null;
  showLoader: boolean;
  lang: any;
  handleHelp: () => void;
  onRefresh: () => void;
}> = ({ loadError, showLoader, lang, handleHelp, onRefresh }) =>
  loadError && !showLoader ? (
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
  ) : null;

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
        <TopBar
          canGoBack={canGoBack}
          showLoader={showLoader}
          loadError={loadError}
          onBack={onBack}
          onRefresh={onRefresh}
          lang={lang}
        />
        <Flex
          $flex={1}
          position="relative"
          align="center"
          justify="center"
          $overflow="hidden"
        >
          <LoaderOverlay show={showLoader} theme={theme} />
          <WebviewSection
            showLoader={showLoader}
            loadError={loadError}
            webviewSrc={webviewSrc}
            webviewRef={webviewRef}
            theme={theme}
          />
          <ErrorDialog
            loadError={loadError}
            showLoader={showLoader}
            lang={lang}
            handleHelp={handleHelp}
            onRefresh={onRefresh}
          />
        </Flex>
      </Flex>
    </MainAppLayout>
  );
};
