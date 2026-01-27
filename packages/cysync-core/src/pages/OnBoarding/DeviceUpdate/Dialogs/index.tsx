import {
  ConfirmationDialog,
  FirmwareDownloadGreenIcon,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import { sleep } from '@cypherock/cysync-utils';
import { FirmwareVariant } from '@cypherock/sdk-app-manager';
import { firmwareVariantFromJSON } from '@cypherock/sdk-app-manager/dist/proto/generated/common';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useEffect, ReactElement, useState } from 'react';

import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { getFirmwareVariantDisplayName, routes } from '~/constants';
import {
  useNavigateTo,
  useDeviceUpdate,
  DeviceUpdateState,
  useQuery,
} from '~/hooks';
import {
  useAppSelector,
  selectLanguage,
  selectLastConnectedFirmware,
} from '~/store';
import { getCloseAppMethod } from '~/utils';

import { DeviceUpdateLoading } from './DeviceUpdateLoading';

const selector = createSelector(
  [selectLanguage, selectLastConnectedFirmware],
  (lang, { isFirmwareBtcOnly }) => ({
    lang,
    isFirmwareBtcOnly,
  }),
);

export const DeviceUpdateDialogBox: FC = () => {
  const { lang, isFirmwareBtcOnly } = useAppSelector(selector);
  const existingVariant = isFirmwareBtcOnly
    ? FirmwareVariant.BTC_ONLY
    : FirmwareVariant.MULTI_COIN;

  const navigateTo = useNavigateTo();
  const [loading, setLoading] = useState(false);

  const query = useQuery();
  let forcedVariant: FirmwareVariant | undefined = firmwareVariantFromJSON(
    query.get('variant'),
  );
  if (
    forcedVariant !== FirmwareVariant.BTC_ONLY &&
    forcedVariant !== FirmwareVariant.MULTI_COIN
  ) {
    forcedVariant = undefined;
  }

  const variant = forcedVariant ?? existingVariant;

  const variantDisplayName = getFirmwareVariantDisplayName(variant);

  const toNextPage = async () => {
    setLoading(true);
    // Wating for the device to restart after update
    await sleep(10000);
    navigateTo(
      `${routes.onboarding.deviceAuthentication.path}?disableNavigation=true`,
    );
    setLoading(false);
  };

  const { state, downloadProgress, version, errorToShow, onRetry } =
    useDeviceUpdate(
      variant,
      forcedVariant === existingVariant ? undefined : forcedVariant,
    );

  useEffect(() => {
    if (state === DeviceUpdateState.NotRequired) {
      toNextPage();
    }
  }, [state]);

  const DeviceUpdateDialogs: Partial<Record<DeviceUpdateState, ReactElement>> =
    {
      [DeviceUpdateState.Checking]: (
        <DeviceUpdateLoading
          text={lang.strings.onboarding.deviceUpdate.dialogs.checking.title}
        />
      ),
      [DeviceUpdateState.Confirmation]: (
        <ConfirmationDialog
          title={
            lang.strings.onboarding.deviceUpdate.dialogs.confirmation.title
          }
          icon={<FirmwareDownloadGreenIcon />}
          subtext={
            lang.strings.onboarding.deviceUpdate.dialogs.confirmation.subtext
          }
          textVariables={{ version, variant: variantDisplayName }}
        />
      ),
      [DeviceUpdateState.Updating]: (
        <ProgressDialog
          title={lang.strings.onboarding.deviceUpdate.dialogs.updating.heading}
          subtext={
            lang.strings.onboarding.deviceUpdate.dialogs.updating.subtext
          }
          icon={<FirmwareDownloadGreenIcon />}
          progress={Number(downloadProgress.toFixed(0))}
          versionTextVariables={{ version, variant: variantDisplayName }}
        />
      ),
      [DeviceUpdateState.Successful]: loading ? (
        <LoaderDialog />
      ) : (
        <SuccessDialog
          title={
            lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful
              .heading
          }
          subtext={
            lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful
              .subtext
          }
          buttonText={lang.strings.buttons.continue}
          handleClick={toNextPage}
        />
      ),
    };

  return (
    <ErrorHandlerDialog
      error={errorToShow}
      noDelay
      defaultMsg={
        lang.strings.onboarding.deviceUpdate.dialogs.updateFailed.subtext
      }
      onRetry={onRetry}
      textVariables={{ version, variant: variantDisplayName }}
      isOnboarding
      onClose={getCloseAppMethod()}
    >
      {DeviceUpdateDialogs[state]}
    </ErrorHandlerDialog>
  );
};
