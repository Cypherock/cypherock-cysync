import { DropDownItemProps } from '@cypherock/cysync-ui';
import { GetLogsStatus, ManagerApp } from '@cypherock/sdk-app-manager';
import { AxiosError } from 'axios';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useDevice } from '~/context';
import {
  DeviceTask,
  ITabs,
  useDeviceTask,
  useErrorHandler,
  useTabsAndDialogs,
} from '~/hooks';
import { sendFeedback } from '~/services';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import {
  getCySyncLogsMethod,
  keyValueStore,
  validateEmail,
  IParsedError,
  getGetSystemInfoMethod,
} from '~/utils';

import { IContactSupportDialogProps, SupportCategoryMap } from './types';

import { ContactForm, ContactSupportSuccess } from '../Dialogs';

export interface ContactSupportDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  error: string | null;
  handleContactSupportSubmit: () => Promise<void>;
  isLoading: boolean;
  isSubmitDisabled: boolean;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  categories: DropDownItemProps[];
  selectedCategory: string | undefined;
  handleCategorySelection: (id: string | undefined) => void;
  description: string | null;
  setDescription: React.Dispatch<React.SetStateAction<string | null>>;
  canAttatchAppLogs: boolean;
  setCanAttatchAppLogs: React.Dispatch<React.SetStateAction<boolean>>;
  canAttatchDeviceLogs: boolean;
  onAttachDeviceLogs: (doAttach: boolean) => Promise<void>;
  emailError: string | null;
  isCategoryError: boolean;
  isDescriptionError: boolean;
  isDesktopLogsLoading: boolean;
  deviceLogsLoadingText?: string;
  deviceLogsError?: IParsedError;
}

export const ContactSupportDialogContext: Context<ContactSupportDialogContextInterface> =
  createContext<ContactSupportDialogContextInterface>(
    {} as ContactSupportDialogContextInterface,
  );

export interface ContactSupportDialogProviderProps
  extends IContactSupportDialogProps {
  children: ReactNode;
}

export const ContactSupportDialogProvider: FC<
  ContactSupportDialogProviderProps
> = ({ children, providedDescription, errorCategory }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const { connection: deviceConnection } = useDevice();

  const categories: DropDownItemProps[] = [
    { text: 'Feedback', id: SupportCategoryMap.Feedback },
    { text: 'Complaint', id: SupportCategoryMap.Complaint },
    { text: 'Others', id: SupportCategoryMap.Others },
  ];

  const [canAttatchAppLogs, setCanAttatchAppLogs] = useState<boolean>(true);
  const [canAttatchDeviceLogs, setCanAttatchDeviceLogs] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(
    providedDescription ?? null,
  );
  const [desktopLogs, setDesktopLogs] = useState<string[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    errorCategory ?? SupportCategoryMap.Complaint,
  );

  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCategoryError, setIsCategoryError] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDesktopLogsLoading, setIsDesktopLogsLoading] = useState(false);
  const [deviceLogsLoadingText, setDeviceLogsLoadingText] = useState<
    string | undefined
  >();
  const [deviceLogsErrorObject, setDeviceLogsErrorObject] = useState<any>();

  const isSubmitDisabled = useMemo(
    () =>
      isLoading ||
      isDesktopLogsLoading ||
      deviceLogsLoadingText !== undefined ||
      emailError !== null ||
      email === null ||
      isCategoryError ||
      selectedCategory === undefined ||
      isDescriptionError ||
      description === null,
    [
      isLoading,
      isDesktopLogsLoading,
      deviceLogsLoadingText,
      emailError,
      email,
      isCategoryError,
      selectedCategory,
      isDescriptionError,
      description,
    ],
  );

  const onClose = () => {
    dispatch(closeDialog('contactSupportDialog'));
  };

  const handleContactSupportSubmit = async () => {
    setIsLoading(true);
    setError(null);

    if (
      email === null ||
      description === null ||
      selectedCategory === undefined
    ) {
      setIsLoading(false);
      return;
    }

    try {
      await sendFeedback({
        email,
        category: selectedCategory,
        description,
        desktopLogs,
        deviceLogs,
        systemInfo: await getGetSystemInfoMethod()(),
        deviceInfo: {
          firmwareVersion: deviceConnection?.firmwareVersion,
          deviceSerial: deviceConnection?.serial,
        },
      });
      setIsLoading(false);
      onNext();
    } catch (apiError) {
      setError(
        ((apiError as AxiosError).response?.data as string) ??
          (apiError as AxiosError).message,
      );
      setIsLoading(false);
    }
  };

  const handleCategorySelection = (id: string | undefined) => {
    setSelectedCategory(id ?? SupportCategoryMap.Feedback);
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.contactSupport.form.title,
      dialogs: [<ContactForm key="contact-support-form" />],
    },
    {
      name: lang.strings.dialogs.contactSupport.success.formSubmit,
      dialogs: [<ContactSupportSuccess key="contact-support-success" />],
    },
  ];

  useEffect(() => {
    keyValueStore.email.get().then(setEmail);
  }, []);

  useEffect(() => {
    if (email === null) {
      setEmailError(null);
      return;
    }

    const result = validateEmail(email, lang);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      keyValueStore.email.remove();
      return;
    }

    setError(null);
    setEmailError(null);
    keyValueStore.email.set(email);
  }, [email]);

  useEffect(() => {
    if (selectedCategory === undefined) {
      setIsCategoryError(true);
      return;
    }
    setIsCategoryError(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (description === null) {
      setIsDescriptionError(false);
      return;
    }

    if (description.length === 0) {
      setIsDescriptionError(true);
      return;
    }

    setIsDescriptionError(false);
  }, [description]);

  useEffect(() => {
    if (canAttatchAppLogs) {
      setIsDesktopLogsLoading(true);
      getCySyncLogsMethod()()
        .then(logs => {
          setDesktopLogs(logs);
          setIsDesktopLogsLoading(false);
        })
        .catch(err => {
          setError((err.message as string) ?? String(err));
          setIsDesktopLogsLoading(false);
        });
    } else {
      setDesktopLogs([]);
    }
  }, [canAttatchAppLogs]);

  const getLogsFromDevice: DeviceTask<string[]> = async connection => {
    const app = await ManagerApp.create(connection);
    const logs = await app.getLogs(event => {
      if (event < GetLogsStatus.GET_LOGS_STATUS_USER_CONFIRMED) {
        setDeviceLogsLoadingText(
          lang.strings.dialogs.contactSupport.form.checks.confirmDevice,
        );
      } else {
        setDeviceLogsLoadingText(
          lang.strings.dialogs.contactSupport.form.checks.fetchingDeviceLogs,
        );
      }
    });

    return logs.split('\n');
  };

  const deviceLogsTask = useDeviceTask(getLogsFromDevice, {
    dontExecuteTask: true,
  });

  const onAttachDeviceLogs = async (doAttach: boolean) => {
    setDeviceLogsErrorObject(undefined);
    setDeviceLogsLoadingText('');

    if (!doAttach) {
      setCanAttatchDeviceLogs(false);
      setDeviceLogsLoadingText(undefined);
      setDeviceLogsErrorObject(undefined);
      setDeviceLogs([]);
      return;
    }

    const { result, error: e } = await deviceLogsTask.run();

    if (e) {
      setCanAttatchDeviceLogs(false);
      setDeviceLogsErrorObject(e);
    }

    if (result) {
      setCanAttatchDeviceLogs(true);
      setDeviceLogs(result);
    }

    setDeviceLogsLoadingText(undefined);
  };

  const { errorToShow: deviceLogsError } = useErrorHandler({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {},
    error: deviceLogsErrorObject,
    isOnboarding: false,
    noDelay: true,
  });

  const {
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
  } = useTabsAndDialogs({
    deviceRequiredDialogsMap,
    tabs,
  });

  const ctx = useMemo(
    () => ({
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      error,
      handleContactSupportSubmit,
      isLoading,
      isSubmitDisabled,
      email,
      setEmail,
      categories,
      selectedCategory,
      handleCategorySelection,
      description,
      setDescription,
      canAttatchAppLogs,
      setCanAttatchAppLogs,
      canAttatchDeviceLogs,
      onAttachDeviceLogs,
      emailError,
      isCategoryError,
      isDescriptionError,
      isDesktopLogsLoading,
      deviceLogsLoadingText,
      deviceLogsError,
    }),
    [
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      error,
      handleContactSupportSubmit,
      isLoading,
      isSubmitDisabled,
      email,
      setEmail,
      categories,
      selectedCategory,
      handleCategorySelection,
      description,
      setDescription,
      canAttatchAppLogs,
      setCanAttatchAppLogs,
      canAttatchDeviceLogs,
      onAttachDeviceLogs,
      emailError,
      isCategoryError,
      isDescriptionError,
      isDesktopLogsLoading,
      deviceLogsLoadingText,
      deviceLogsError,
    ],
  );

  return (
    <ContactSupportDialogContext.Provider value={ctx}>
      {children}
    </ContactSupportDialogContext.Provider>
  );
};

export function useContactSupportDialog(): ContactSupportDialogContextInterface {
  return useContext(ContactSupportDialogContext);
}
