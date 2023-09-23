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
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { DropDownListItemProps } from '@cypherock/cysync-ui';
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
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
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
    { text: 'Feedback', id: 'feedback' },
    { text: 'Bug Report', id: 'bugReport' },
  ];

  const [email, setEmail] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    categories[0].id,
  );
  const [description, setDescription] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const validateForm = () => {
    let isSubmitDisabledNew = Boolean(error);
    isSubmitDisabledNew ||= isLoading;

    setIsSubmitDisabled(isSubmitDisabledNew);
  };

  useEffect(validateForm, [error, isLoading]);

  const onClose = () => {
    dispatch(closeDialog('changePassword'));
  };

  const handleContactSupportSubmit = async () => {
    setIsLoading(true);
    // ...
    setError(null);
    // ...
    setIsLoading(false);
    onNext();
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.password.confimPassword.title,
      dialogs: [<ContactForm key="contact-support-form" />],
    },
    {
      name: lang.strings.dialogs.password.success.change,
      dialogs: [<ContactSupportSuccess key="contact-support-success" />],
    },
  ];

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
      setSelectedCategory,
      description,
      setDescription,
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
      setSelectedCategory,
      description,
      setDescription,
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
