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
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { addKeyboardEvents, useStateWithRef } from '~/hooks';

import { GuidedFlowType, selectLanguage, useAppSelector } from '../../..';
import { FinalMessage } from '../Dialogs/FinalMessage';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface GuidedFlowContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: (data: number) => void;
  currentDialog: number;
  setCurrentDialog: (data: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  blastConfetti: boolean;
  showBackButton: boolean;
}

export const GuidedFlowContext: Context<GuidedFlowContextInterface> =
  createContext<GuidedFlowContextInterface>({} as GuidedFlowContextInterface);

export interface GuidedFlowContextProviderProps {
  children: ReactNode;
  type: GuidedFlowType;
}

const dialogsImages: Record<GuidedFlowType, string[][]> = {
  createWallet: [
    [
      confirmGenericDeviceImage,
      confirmGenericDeviceImage,
      inputAlphabeticDeviceImage,
      confirmAlphabeticDeviceImage,
      confirmPinDeviceImage,
      inputNumericDeviceImage,
      confirmNumericDeviceImage,
    ],
    [tapCardsDeviceImage],
    [successIcon, successIcon, successIcon, informationIcon, informationIcon],
  ],
};

interface IGuidedDialogContent {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
}

export const GuidedFlowProvider: FC<GuidedFlowContextProviderProps> = ({
  children,
  type,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [tabs, setTabs, tabsRef] = useStateWithRef<ITabs>([]);
  const [currentTab, setCurrentTab, tabRef] = useStateWithRef(0);
  const [currentDialog, setCurrentDialog, dialogRef] = useStateWithRef(0);
  const [isConfettiBlastDone, setIsConfettiBlastDone] = useState(false);
  const [blastConfetti, setBlastConfetti] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  const checkConfettiBlastDone = () => {
    if (tabRef.current === 2 && dialogRef.current === 0)
      setIsConfettiBlastDone(true);
  };

  const onNext = () => {
    checkConfettiBlastDone();
    if (
      dialogRef.current + 1 >
      tabsRef.current[tabRef.current].dialogs.length - 1
    ) {
      setCurrentTab(Math.min(tabsRef.current.length - 1, tabRef.current + 1));
      if (tabRef.current !== tabsRef.current.length - 1) {
        setCurrentDialog(0);
      }
    } else {
      setCurrentDialog(
        Math.min(
          tabsRef.current[tabRef.current].dialogs.length - 1,
          dialogRef.current + 1,
        ),
      );
    }
  };

  const onPrevious = () => {
    checkConfettiBlastDone();
    if (dialogRef.current - 1 < 0) {
      if (tabRef.current === 0) {
        setCurrentDialog(0);
      } else {
        setCurrentDialog(
          tabsRef.current[tabRef.current - 1].dialogs.length - 1,
        );
        setCurrentTab(Math.max(0, tabRef.current - 1));
      }
    } else {
      setCurrentDialog(Math.max(0, dialogRef.current - 1));
    }
  };

  addKeyboardEvents({
    ArrowRight: onNext,
    ArrowLeft: onPrevious,
  });

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

  const init = () => {
    const initTabs = lang.strings.guidedFlows[type].tabs.map((tab, index) => ({
      name: tab.asideTitle,
      dialogs: getDialogArray(
        dialogsImages[type][index],
        tab.pages as any,
        index === 0,
      ),
    }));
    initTabs[initTabs.length - 1].dialogs.push(<FinalMessage />);
    setTabs(initTabs);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setBlastConfetti(
      !isConfettiBlastDone && currentTab === 2 && currentDialog === 0,
    );
    setShowBackButton(currentTab === 0 && currentDialog === 0);
  }, [currentTab, currentDialog]);

  const ctx = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      onPrevious,
      blastConfetti,
      showBackButton,
    }),
    [
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      onPrevious,
      blastConfetti,
      showBackButton,
    ],
  );

  return (
    <GuidedFlowContext.Provider value={ctx}>
      {children}
    </GuidedFlowContext.Provider>
  );
};

export function useGuidedFlow(): GuidedFlowContextInterface {
  return useContext(GuidedFlowContext);
}
