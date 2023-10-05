import { DropDownListItemProps } from '@cypherock/cysync-ui';
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

import { ITabs, useTabsAndDialogs } from '~/hooks';
import { sendFeedback } from '~/services/feedbackService';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { keyValueStore, validateEmail } from '~/utils';

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
  categories: DropDownListItemProps[];
  selectedCategory: string | undefined;
  handleCategorySelection: (id: string | undefined) => void;
  description: string | null;
  setDescription: React.Dispatch<React.SetStateAction<string | null>>;
  canAttatchAppLogs: boolean;
  setCanAttatchAppLogs: React.Dispatch<React.SetStateAction<boolean>>;
  canAttatchDeviceLogs: boolean;
  setCanAttatchDeviceLogs: React.Dispatch<React.SetStateAction<boolean>>;
  isEmailError: boolean;
  isCategoryError: boolean;
  isDescriptionError: boolean;
}

export const ContactSupportDialogContext: Context<ContactSupportDialogContextInterface> =
  createContext<ContactSupportDialogContextInterface>(
    {} as ContactSupportDialogContextInterface,
  );

export interface ContactSupportDialogProviderProps {
  children: ReactNode;
}

export const ContactSupportDialogProvider: FC<
  ContactSupportDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const categories: DropDownListItemProps[] = [
    { text: 'Feedback', id: 'Feedback' },
    { text: 'Complaint', id: 'Complaint' },
    { text: 'Others', id: 'Others' },
  ];

  const [canAttatchAppLogs, setCanAttatchAppLogs] = useState<boolean>(false);
  const [canAttatchDeviceLogs, setCanAttatchDeviceLogs] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    categories[0].id,
  );

  const [error, setError] = useState<string | null>(null);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isCategoryError, setIsCategoryError] = useState<boolean>(false);
  const [isDescriptionError, setIsDescriptionError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSubmitDisabled = useMemo<boolean>(
    () =>
      isLoading ||
      isEmailError ||
      email === null ||
      isCategoryError ||
      selectedCategory === undefined ||
      isDescriptionError ||
      description === null,
    [
      isLoading,
      isEmailError,
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

    const category = categories.find(c => c.id === selectedCategory);

    if (email === null || description === null || category === undefined) {
      setIsLoading(false);
      return;
    }

    try {
      await sendFeedback(email, category.text, description);
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
    setSelectedCategory(id);
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
      setIsEmailError(false);
      return;
    }

    const result = validateEmail(email, lang);
    if (!result.success) {
      setIsEmailError(true);
      setError(result.error.errors[0].message);
      keyValueStore.email.remove();
      return;
    }

    setError(null);
    setIsEmailError(false);
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
      setCanAttatchDeviceLogs,
      isEmailError,
      isCategoryError,
      isDescriptionError,
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
      setCanAttatchDeviceLogs,
      isEmailError,
      isCategoryError,
      isDescriptionError,
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
