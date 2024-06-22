// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ClearDeviceData,
  ConfirmCreateWalletDeviceGraphics,
  ConfirmTransferDeviceGraphics,
  EnterPin,
  Image,
  MainMenu,
  MessageBoxType,
  PairCards,
  Restore,
  SettingsDevice,
  Video,
  ViewSeed,
  successIcon,
  tapAllCardDeviceAnimation2DVideo,
  WalletTransferLostCardsFlowDialogBox,
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

import { openGuidedFlowDialog } from '~/actions';
import { FinalMessage } from '~/dialogs/GuidedFlow/Dialogs/FinalMessage';
import { addKeyboardEvents, useStateWithRef } from '~/hooks';

import {
  WalletTransferLostCardsFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '../../..';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface WalletTransferLostCardsFlowContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: (data: number) => void;
  currentDialog: number;
  setCurrentDialog: (data: number) => void;
  onNext: () => void;
  changeCondition?: () => void;
  onPrevious: () => void;
  blastConfetti: boolean;
  showBackButton: boolean;
  onCloseDialog: () => void;
  title: string;
}

export const WalletTransferLostCardsFlowContext: Context<WalletTransferLostCardsFlowContextInterface> =
  createContext<WalletTransferLostCardsFlowContextInterface>(
    {} as WalletTransferLostCardsFlowContextInterface,
  );

export interface WalletTransferLostCardsFlowContextProviderProps {
  children: ReactNode;
  type: WalletTransferLostCardsFlowType;
}

const successIconReactElement = <Image src={successIcon} alt="device" />;

const dialogsImages: Record<
  WalletTransferLostCardsFlowType,
  React.ReactElement[][]
> = {
  walletTransferLostCards: [
    [],
    [
      <SettingsDevice />,
      <ClearDeviceData />,
      <ClearDeviceData />,
      successIconReactElement,
      <SettingsDevice />,
      <PairCards />,
      <ConfirmTransferDeviceGraphics />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      successIconReactElement,
      <SettingsDevice />,
      <Restore />,
      <ConfirmTransferDeviceGraphics />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      <ConfirmTransferDeviceGraphics />,
      <EnterPin />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      successIconReactElement,
      <MainMenu />,
      <ViewSeed />,
      <EnterPin />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      successIconReactElement,
      <SettingsDevice />,
      <ClearDeviceData />,
      <ConfirmTransferDeviceGraphics />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      successIconReactElement,
      <SettingsDevice />,
      <PairCards />,
      <ConfirmTransferDeviceGraphics />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      successIconReactElement,
      <ConfirmCreateWalletDeviceGraphics />,
    ],
    [],
    [],
  ],
};

interface ITransferDialogContent {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
}

export const WalletTransferLostCardsFlowProvider: FC<
  WalletTransferLostCardsFlowContextProviderProps
> = ({ children, type }) => {
  const lang = useAppSelector(selectLanguage);
  const [tabs, setTabs, tabsRef] = useStateWithRef<ITabs>([]);
  const [currentTab, setCurrentTab, tabRef] = useStateWithRef(1);
  const [currentDialog, setCurrentDialog, dialogRef] = useStateWithRef(0);
  const [isConfettiBlastDone, setIsConfettiBlastDone] = useState(false);
  const [blastConfetti, setBlastConfetti] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState('');
  const displayText = lang.strings.guidedFlows[type];

  const dispatch = useAppDispatch();

  const checkConfettiBlastDone = () => {
    if (
      (tabRef.current === 1 && dialogRef.current === 12) ||
      (tabRef.current === 2 && dialogRef.current === 3)
    ) {
      setIsConfettiBlastDone(true);
    }
  };

  const onNext = () => {
    checkConfettiBlastDone();
    if (
      dialogRef.current + 1 >
      tabsRef.current[tabRef.current].dialogs.length - 1
    ) {
      const newCurrentTab = Math.min(
        tabsRef.current.length - 1,
        tabRef.current + 1,
      );
      if (tabRef.current !== tabsRef.current.length - 1) {
        setCurrentDialog(0);
      }
      setCurrentTab(newCurrentTab);
    } else {
      setCurrentDialog(
        Math.min(
          tabsRef.current[tabRef.current].dialogs.length - 1,
          dialogRef.current + 1,
        ),
      );
    }
  };

  if (dialogRef.current === 32) {
    dispatch(closeDialog('walletTransferLostCardsFlow'));
    dispatch(openGuidedFlowDialog('importWallet'));
  }
  const onPrevious = () => {
    if (
      window.location.hash === '#/settings' &&
      tabRef.current === 1 &&
      dialogRef.current === 0
    ) {
      return;
    }

    checkConfettiBlastDone();

    if (dialogRef.current - 1 < 0) {
      if (tabRef.current > 1) {
        const newTab = Math.max(1, tabRef.current - 1);
        setCurrentTab(newTab);
        setCurrentDialog(tabsRef.current[newTab].dialogs.length - 1);
      } else {
        // This condition is met if we're already at the first dialog of the first tab,
        // so you might not need to do anything here or adjust based on your flow.
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
    images: React.ReactElement[],
    contents: ITransferDialogContent[],
    first?: boolean,
  ) =>
    contents.map((content, index) => (
      <WalletTransferLostCardsFlowDialogBox
        key={`${index + 1}`}
        image={images[index]}
        {...content}
        onNext={onNext}
        onPrevious={onPrevious}
        disablePrev={first && index === 0}
      />
    ));

  const init = () => {
    const initTabs = displayText.tabs.map((tab, index) => ({
      name: tab.asideTitle,
      dialogs: getDialogArray(
        dialogsImages[type][index],
        tab.pages as any,
        index === 0,
      ),
    }));
    initTabs[initTabs.length - 1].dialogs.push(
      <FinalMessage
        DialogBox={WalletTransferLostCardsFlowDialogBox}
        contextHook={useWalletTransferLostCardsFlow}
      />,
    );
    setTabs(initTabs);
    setTitle(displayText.title);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const shouldBlastConfetti =
      (isConfettiBlastDone && currentTab === 1 && currentDialog === 16) ||
      (currentTab === 3 && currentDialog === 0);

    setBlastConfetti(shouldBlastConfetti);

    setShowBackButton(currentTab === 0 && currentDialog === 0);
  }, [currentTab, currentDialog]);

  const onCloseDialog = () => {
    setCurrentTab(0);
    setCurrentDialog(0);
    dispatch(closeDialog('walletTransferLostCardsFlow'));
  };

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
      onCloseDialog,
      title,
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
      onCloseDialog,
      title,
    ],
  );

  return (
    <WalletTransferLostCardsFlowContext.Provider value={ctx}>
      {children}
    </WalletTransferLostCardsFlowContext.Provider>
  );
};

export function useWalletTransferLostCardsFlow(): WalletTransferLostCardsFlowContextInterface {
  return useContext(WalletTransferLostCardsFlowContext);
}
