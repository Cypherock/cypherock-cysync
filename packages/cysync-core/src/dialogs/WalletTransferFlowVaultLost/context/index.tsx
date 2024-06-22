// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ConfirmCreateWalletDeviceGraphics,
  EnterPin,
  Image,
  MessageBoxType,
  Video,
  WalletTransferLostCardsFlowDialogBox,
  successIcon,
  tapAllCardDeviceAnimation2DVideo,
  SettingsDevice,
  ClearDeviceData,
  ViewSeed,
  ConfirmTransferDeviceGraphics,
  MainMenu,
  PairCards,
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
  WalletTransferFlowLostVaultType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '../../..';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface WalletTransferLostVaultFlowContextInterface {
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

export const WalletTransferLostVaultFlowContext: Context<WalletTransferLostVaultFlowContextInterface> =
  createContext<WalletTransferLostVaultFlowContextInterface>(
    {} as WalletTransferLostVaultFlowContextInterface,
  );

export interface WalletTransferLostVaultFlowContextProviderProps {
  children: ReactNode;
  type: WalletTransferFlowLostVaultType;
}

const successIconReactElement = <Image src={successIcon} alt="device" />;

const dialogsImages: Record<
  WalletTransferFlowLostVaultType,
  React.ReactElement[][]
> = {
  walletTransferLostVault: [
    [
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

export const WalletTransferLostVaultFlowProvider: FC<
  WalletTransferLostVaultFlowContextProviderProps
> = ({ children, type }) => {
  const lang = useAppSelector(selectLanguage);
  const [tabs, setTabs, tabsRef] = useStateWithRef<ITabs>([]);
  const [currentTab, setCurrentTab, tabRef] = useStateWithRef(0);
  const [currentDialog, setCurrentDialog, dialogRef] = useStateWithRef(0);
  const [isConfettiBlastDone, setIsConfettiBlastDone] = useState(false);
  const [blastConfetti, setBlastConfetti] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState('');
  const displayText = lang.strings.guidedFlows[type];

  const dispatch = useAppDispatch();

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

  if (dialogRef.current === 15) {
    dispatch(closeDialog('walletTransferLostVaultFlow'));
    dispatch(openGuidedFlowDialog('importWallet'));
  }

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
        contextHook={useWalletTransferLostVaulFlow}
      />,
    );
    setTabs(initTabs);
    setTitle(displayText.title);
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

  const onCloseDialog = () => {
    setCurrentTab(0);
    setCurrentDialog(0);
    dispatch(closeDialog('walletTransferLostVaultFlow'));
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
    <WalletTransferLostVaultFlowContext.Provider value={ctx}>
      {children}
    </WalletTransferLostVaultFlowContext.Provider>
  );
};

export function useWalletTransferLostVaulFlow(): WalletTransferLostVaultFlowContextInterface {
  return useContext(WalletTransferLostVaultFlowContext);
}
