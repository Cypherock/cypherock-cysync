import React, {
  Context,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs } from '~/hooks';

import { useInheritanceEditEncryptedMessageDialogHandler } from './useDialogHandler';

interface IEncryptedMessage {
  cardLocation: string;
  personalMessage: string;
}

export interface InheritanceEditEncryptedMessageDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
  fetchData: () => void;
  encryptedMessage: IEncryptedMessage;
  setEncryptedMessage: Dispatch<SetStateAction<IEncryptedMessage>>;
}

export const InheritanceEditEncryptedMessageDialogContext: Context<InheritanceEditEncryptedMessageDialogContextInterface> =
  createContext<InheritanceEditEncryptedMessageDialogContextInterface>(
    {} as InheritanceEditEncryptedMessageDialogContextInterface,
  );

export interface InheritanceEditEncryptedMessageDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceEditEncryptedMessageDialogProvider: FC<
  InheritanceEditEncryptedMessageDialogContextProviderProps
> = ({ children }) => {
  const {
    currentDialog,
    currentTab,
    goTo,
    isDeviceRequired,
    onClose,
    onNext,
    onPrevious,
    tabs,
  } = useInheritanceEditEncryptedMessageDialogHandler();

  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>({
    cardLocation: '',
    personalMessage: '',
  });

  const fetchData = () => {
    'Implement this function';

    const dummy =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id  ullamcorper dui, sed vestibulum libero. Lorem ipsum dolor sit amet,  consectetur adipiscing elit. Sed placerat nibh sed justo sagittis  venenatis. Nullam dictum ipsum ac nunc aliquet, ut condimentum nibh  pharetra. Pellentesque interdum dignissim blandit. Nullam ac tincidunt  lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices  posuere cubilia curae; Vivamus magna velit, pulvinar euismod nisi non,  venenatis vehicula justo. Morbi ligula purus, condimentum vitae eleifend  ut, mattis at diam. Sed non pulvinar ex.';
    setEncryptedMessage({
      cardLocation: dummy,
      personalMessage: dummy,
    });
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      encryptedMessage,
      setEncryptedMessage,
      fetchData,
    }),
    [
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      encryptedMessage,
      setEncryptedMessage,
      fetchData,
    ],
  );

  return (
    <InheritanceEditEncryptedMessageDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditEncryptedMessageDialogContext.Provider>
  );
};

export function useInheritanceEditEncryptedMessageDialog(): InheritanceEditEncryptedMessageDialogContextInterface {
  return useContext(InheritanceEditEncryptedMessageDialogContext);
}
