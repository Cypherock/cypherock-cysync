// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  GuidedFlowDialogBox,
  MessageBoxType,
  confirmAlphabeticDeviceImage,
  confirmGenericDeviceImage,
  confirmNumericDeviceImage,
  confirmPinDeviceImage,
  informationIcon,
  inputAlphabeticDeviceImage,
  inputNumericDeviceImage,
  successIcon,
  tapCardsDeviceImage,
} from '@cypherock/cysync-ui';
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

import { selectLanguage, useAppSelector } from '../../..';
import { FinalMessage } from '../Dialogs/FinalMessage';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface CreateWalletGuideContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
  onNext: () => void;
  onPrevious: () => void;
  isConfettiBlastDone: boolean;
}

export const CreateWalletGuideContext: Context<CreateWalletGuideContextInterface> =
  createContext<CreateWalletGuideContextInterface>(
    {} as CreateWalletGuideContextInterface,
  );

export interface CreateWalletGuideContextProviderProps {
  children: ReactNode;
}

const dialogsImages = {
  device: [
    confirmGenericDeviceImage,
    confirmGenericDeviceImage,
    inputAlphabeticDeviceImage,
    confirmAlphabeticDeviceImage,
    confirmPinDeviceImage,
    inputNumericDeviceImage,
    confirmNumericDeviceImage,
  ],
  syncX1Cards: [tapCardsDeviceImage],
  confirmation: [
    successIcon,
    successIcon,
    successIcon,
    informationIcon,
    informationIcon,
  ],
};

interface IGuidedDialogContent {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
}

export const CreateWalletGuideProvider: FC<
  CreateWalletGuideContextProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<number>(0);
  const [isConfettiBlastDone, setIsConfettiBlastDone] = useState(false);

  const checkConfettiBlastDone = () => {
    if (currentTab === 2 && currentDialog === 0) setIsConfettiBlastDone(true);
  };

  const onNext = () => {
    checkConfettiBlastDone();
    if (currentDialog + 1 > tabs[currentTab].dialogs.length - 1) {
      setCurrentTab(prevProps => Math.min(tabs.length - 1, prevProps + 1));
      if (currentTab !== tabs.length - 1) {
        setCurrentDialog(0);
      }
    } else {
      setCurrentDialog(prevProps =>
        Math.min(tabs[currentTab].dialogs.length - 1, prevProps + 1),
      );
    }
  };

  const onPrevious = () => {
    checkConfettiBlastDone();
    if (currentDialog - 1 < 0) {
      if (currentTab === 0) {
        setCurrentDialog(0);
      } else {
        setCurrentDialog(tabs[currentTab - 1].dialogs.length - 1);
        setCurrentTab(prevProps => Math.max(0, prevProps - 1));
      }
    } else {
      setCurrentDialog(prevProps => Math.max(0, prevProps - 1));
    }
  };

  const getDialogArray = (
    images: string[],
    contents: IGuidedDialogContent[],
    first?: boolean,
  ) =>
    contents.map((content, index) => (
      <GuidedFlowDialogBox
        key={`${index + 1}`}
        image={images[index]}
        {...content}
        onNext={onNext}
        onPrevious={onPrevious}
        disablePrev={first && index === 0}
      />
    ));

  const tabs: ITabs = [
    {
      name: lang.strings.guidedFlows.createWallet.device.asideTitle,
      dialogs: getDialogArray(
        dialogsImages.device,
        lang.strings.guidedFlows.createWallet.device.pages as any,
        true,
      ),
    },
    {
      name: lang.strings.guidedFlows.createWallet.syncX1Cards.asideTitle,
      dialogs: getDialogArray(
        dialogsImages.syncX1Cards,
        lang.strings.guidedFlows.createWallet.syncX1Cards.pages as any,
      ),
    },
    {
      name: lang.strings.guidedFlows.createWallet.confirmation.asideTitle,
      dialogs: [
        ...getDialogArray(
          dialogsImages.confirmation,
          lang.strings.guidedFlows.createWallet.confirmation.pages as any,
        ),
        <FinalMessage />,
      ],
    },
  ];

  const ctx = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      onPrevious,
      isConfettiBlastDone,
    }),
    [
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      onPrevious,
      isConfettiBlastDone,
    ],
  );

  return (
    <CreateWalletGuideContext.Provider value={ctx}>
      {children}
    </CreateWalletGuideContext.Provider>
  );
};

export function useCreateWalletGuide(): CreateWalletGuideContextInterface {
  return useContext(CreateWalletGuideContext);
}
