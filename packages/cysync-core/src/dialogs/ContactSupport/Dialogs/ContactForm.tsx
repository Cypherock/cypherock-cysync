import {
  Button,
  CheckBox,
  CloseButton,
  Container,
  CrossMark,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Disconnected,
  Divider,
  Dropdown,
  Flex,
  Input,
  InputLabel,
  LangDisplay,
  ScrollableContainer,
  TextAreaInput,
  ThemeType,
  Typography,
  useTheme,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useRef } from 'react';

import { DeviceHandlingState, useDevice } from '~/context';
import { ILangState, selectLanguage, useAppSelector } from '~/store';

import { useContactSupportDialog } from '../context';

interface DeviceConnectionErrorDisplayProps {
  theme: ThemeType;
  strings: ILangState['strings'];
  state: DeviceHandlingState;
}

const DeviceConnectionErrorDisplay: React.FC<
  DeviceConnectionErrorDisplayProps
> = ({ strings, state, theme }) => {
  if (state === DeviceHandlingState.USABLE) {
    return null;
  }

  const detailsMap: Partial<
    Record<DeviceHandlingState, { icon: React.ReactNode; text: string }>
  > = {
    [DeviceHandlingState.NOT_CONNECTED]: {
      icon: <Disconnected fill={theme.palette.warn.main} />,
      text: strings.dialogs.contactSupport.form.errors.connectDevice,
    },
    [DeviceHandlingState.BOOTLOADER]: {
      icon: <CrossMark stroke={theme.palette.warn.main} />,
      text: strings.dialogs.contactSupport.form.errors.bootloaderMode,
    },
  };

  const details =
    detailsMap[state] ?? detailsMap[DeviceHandlingState.NOT_CONNECTED];

  if (!details) return null;

  return (
    <Container justify="flex-start">
      <Container mr={2}>{details.icon}</Container>
      <Typography color="muted" $fontWeight="light" $fontSize={16}>
        {details.text}
      </Typography>
    </Container>
  );
};

export const ContactForm: React.FC = () => {
  const {
    onClose,
    error,
    deviceLogsError,
    handleContactSupportSubmit,
    isLoading,
    isSubmitDisabled,
    email,
    setEmail,
    emailError,
    categories,
    selectedCategory,
    handleCategorySelection,
    description,
    setDescription,
    canAttatchAppLogs,
    setCanAttatchAppLogs,
    canAttatchDeviceLogs,
    onAttachDeviceLogs,
    isDesktopLogsLoading,
    deviceLogsLoadingText,
  } = useContactSupportDialog();

  const { connection, getDeviceHandlingState } = useDevice();
  const { strings } = useAppSelector(selectLanguage);
  const theme = useTheme();
  const { buttons, dialogs } = strings;
  const { form } = dialogs.contactSupport;
  const containerRef = useRef<null | HTMLDivElement>(null);
  const deviceHandlingState = useMemo<DeviceHandlingState>(() => {
    const deviceState = getDeviceHandlingState();
    if (
      [
        DeviceHandlingState.NOT_ONBOARDED,
        DeviceHandlingState.NOT_AUTHENTICATED,
        DeviceHandlingState.USABLE,
        DeviceHandlingState.BUSY,
      ].includes(deviceState)
    ) {
      // during onboarding, convert all the functional states to USABLE
      return DeviceHandlingState.USABLE;
    }
    return deviceState;
  }, [connection]);

  useEffect(() => {
    // scroll to bottom to make the error visible
    if (error || deviceLogsError)
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [error, deviceLogsError]);

  return (
    <DialogBox
      width={500}
      $maxHeight="90vh"
      align="stretch"
      gap={0}
      onClose={onClose}
    >
      <DialogBoxHeader direction="row" py={2} px={3}>
        <Typography
          pl={3}
          grow={1}
          $alignSelf="stretch"
          color="muted"
          $textAlign="center"
        >
          <LangDisplay text={form.header} />
        </Typography>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer ref={containerRef}>
        <DialogBoxBody gap={0} p={0} align="stretch">
          <Flex px={5} py={4} gap={4} direction="column" align="center">
            <Typography $fontSize={20} color="white">
              <LangDisplay text={form.title} />
            </Typography>
            <Typography $fontSize={16} color="muted">
              <LangDisplay text={form.description} />
            </Typography>
          </Flex>
          <Flex
            gap={24}
            px={5}
            pt={2}
            pb={4}
            direction="column"
            align="stretch"
          >
            <form
              onSubmit={e => {
                e.preventDefault();
                handleContactSupportSubmit();
              }}
              id="contact-support-form"
            >
              <Flex gap={16} direction="column" align="stretch">
                <Input
                  pasteAllowed
                  name="email"
                  type="email"
                  placeholder={form.field.email.placeholder}
                  label={form.field.email.label}
                  value={email ?? ''}
                  onChange={setEmail}
                  $error={emailError !== null}
                />
                {/* show email validation error just below the input */}
                {emailError && (
                  <Typography $fontSize={16} pb={4} color="error">
                    {emailError}
                  </Typography>
                )}
                <Flex direction="column" align="stretch" gap={0}>
                  <InputLabel>
                    <LangDisplay text={form.field.category.label} />
                  </InputLabel>
                  <Dropdown
                    items={categories}
                    selectedItem={selectedCategory}
                    searchText={form.field.category.placeholder}
                    placeholderText={form.field.category.placeholder}
                    onChange={handleCategorySelection}
                    disabled={isLoading}
                  />
                </Flex>
                <Flex direction="column" align="stretch" gap={0}>
                  <InputLabel>
                    <LangDisplay text={form.field.description.label} />
                  </InputLabel>
                  <TextAreaInput
                    placeholder={form.field.description.placeholder}
                    value={description ?? ''}
                    onChange={val => setDescription(val)}
                    disabled={isLoading}
                  />
                </Flex>
                <CheckBox
                  label={form.checks.attachAppLogs}
                  checked={canAttatchAppLogs}
                  isDisabled={isLoading}
                  isLoading={isDesktopLogsLoading}
                  id="attatch-app-logs"
                  onChange={() => setCanAttatchAppLogs(!canAttatchAppLogs)}
                />
                <CheckBox
                  label={
                    deviceLogsLoadingText ??
                    (canAttatchDeviceLogs
                      ? form.checks.attachedDeviceLogs
                      : form.checks.attachDeviceLogs)
                  }
                  labelProps={{
                    color:
                      deviceLogsLoadingText === undefined ? 'muted' : 'warn',
                  }}
                  checked={canAttatchDeviceLogs}
                  isLoading={deviceLogsLoadingText !== undefined}
                  isDisabled={
                    isLoading ||
                    (!canAttatchDeviceLogs &&
                      deviceHandlingState !== DeviceHandlingState.USABLE)
                  }
                  id="attatch-device-logs"
                  onChange={() => onAttachDeviceLogs(!canAttatchDeviceLogs)}
                />
                {(error ||
                  deviceLogsError ||
                  deviceHandlingState !== DeviceHandlingState.USABLE) && (
                  <Divider variant="horizontal" />
                )}
              </Flex>
            </form>
            <DeviceConnectionErrorDisplay
              state={deviceHandlingState}
              strings={strings}
              theme={theme}
            />
            {!error && deviceLogsError && (
              <Container display="block">
                <Typography
                  variant="h6"
                  color="error"
                  $fontWeight="light"
                  $textAlign="center"
                >
                  {`${deviceLogsError.heading} (${deviceLogsError.code})`}
                </Typography>
                {deviceLogsError.subtext && (
                  <Typography
                    color="muted"
                    $fontWeight="light"
                    $textAlign="center"
                    $fontSize={14}
                    mt={1}
                  >
                    {deviceLogsError.subtext}
                  </Typography>
                )}
              </Container>
            )}
            {error && (
              <Typography $fontSize={16} pb={4} color="error">
                {error}
              </Typography>
            )}
          </Flex>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.cancel} />
        </Button>
        <Button
          form="contact-support-form"
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
          isLoading={isLoading}
        >
          <LangDisplay text={buttons.submit} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
