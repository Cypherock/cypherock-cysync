import { IWallet } from '@cypherock/db-interfaces';
import React from 'react';

import { openContactSupportDialog } from '~/actions/dialog';
import { deleteWallets } from '~/actions/wallet/deleteWallets';
import { DEVICE_LISTENER_INTERVAL } from '~/context/device/helpers';
import { SupportCategoryMap } from '~/dialogs/ContactSupport';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import {
  ErrorActionButtonHandler,
  ErrorActionButtonHandlerMap,
  getParsedError,
  IErrorActionButtonDetails,
  IParsedError,
} from '~/utils/error';
import logger from '~/utils/logger';

import { useNavigateTo } from './useNavigateTo';

import { routes } from '..';

export interface IErrorHandlerParams {
  error?: Error;
  defaultMsg?: string;
  onRetry?: () => void;
  onClose: () => void;
  isOnboarding?: boolean;
  selectedWallet?: IWallet;
  noDelay?: boolean;
}

export const useErrorHandler = (params: IErrorHandlerParams) => {
  const {
    error,
    defaultMsg,
    onRetry,
    onClose,
    isOnboarding,
    noDelay,
    selectedWallet,
  } = params;

  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const dispatch = useAppDispatch();

  const [errorToShow, setErrorToShow] = React.useState<
    IParsedError | undefined
  >();
  const [retries, setRetries] = React.useState<number>(0);

  const errorMsg = React.useMemo(() => {
    if (error) {
      logger.error(error);
    }

    return error
      ? getParsedError({ error, defaultMsg, lang, retries })
      : undefined;
  }, [error, lang, retries]);

  const onClickHandler = (details: IErrorActionButtonDetails) => {
    const onClickHandlersMap: Record<ErrorActionButtonHandler, () => void> = {
      [ErrorActionButtonHandlerMap.retry]: () => {
        if (onRetry) {
          setRetries(r => r + 1);
          onRetry();
        }
      },
      [ErrorActionButtonHandlerMap.report]: () => {
        dispatch(
          openContactSupportDialog({
            providedDescription: `${errorToShow?.heading} (${errorToShow?.code})`,
            errorCategory: SupportCategoryMap.Complaint,
          }),
        );
      },
      [ErrorActionButtonHandlerMap.help]: () => {
        dispatch(
          openContactSupportDialog({
            providedDescription: `${errorToShow?.heading} (${errorToShow?.code})`,
            errorCategory: SupportCategoryMap.Complaint,
          }),
        );
      },
      [ErrorActionButtonHandlerMap.updateFirmware]: () => {
        onClose();
        if (isOnboarding) {
          navigateTo(routes.onboarding.deviceUpdate.path);
        } else {
          // TODO: Add support for updating firmware on main application
          logger.warn(
            `Unimplemented handler ${ErrorActionButtonHandlerMap.updateFirmware}`,
          );
        }
      },
      [ErrorActionButtonHandlerMap.update]: () => {
        if (isOnboarding) {
          navigateTo(routes.onboarding.appUpdate.path);
        } else {
          // TODO: Add support for updating on main application
          logger.warn(
            `Unimplemented handler ${ErrorActionButtonHandlerMap.update}`,
          );
        }
      },
      [ErrorActionButtonHandlerMap.toOnboarding]: () => {
        navigateTo(routes.onboarding.info.path);
      },
      [ErrorActionButtonHandlerMap.deleteWallets]: () => {
        if (selectedWallet) dispatch(deleteWallets([selectedWallet]));
        onClose();
      },
      [ErrorActionButtonHandlerMap.close]: () => {
        onClose();
      },
    };

    const handler = onClickHandlersMap[details.handler];

    if (handler) handler();
  };

  const onPrimaryClick = () => {
    if (!errorToShow?.primaryAction.handler) return;

    onClickHandler(errorToShow.primaryAction);
  };

  const onSecondaryClick = () => {
    if (!errorToShow?.secondaryAction?.handler) return;

    onClickHandler(errorToShow.secondaryAction);
  };

  /**
   * We need to wait for a certain time before showing the error because:
   *
   * If the device is disconnected, it'll be recognized by the application
   * after ${DEVICE_LISTENER_INTERVAL} ms.
   * And we don't want to show any errors if the device is disconnected.
   */
  React.useEffect(() => {
    let timeout: any;

    if (errorMsg) {
      if (!noDelay) {
        timeout = setTimeout(() => {
          setErrorToShow(errorMsg);
        }, DEVICE_LISTENER_INTERVAL);
      } else {
        setErrorToShow(errorMsg);
      }
    } else if (errorToShow) {
      setErrorToShow(undefined);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [errorMsg]);

  return {
    errorToShow,
    onPrimaryClick,
    onSecondaryClick,
  };
};
