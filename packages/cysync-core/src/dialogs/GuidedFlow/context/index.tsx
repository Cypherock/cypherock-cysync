// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ConfirmCreatePinDeviceGraphics,
  ConfirmCreateWalletDeviceGraphics,
  ConfirmRestoreFromSeedphraseDeviceGraphics,
  ConfirmWalletNameDeviceGraphics,
  EnterPinDeviceGraphics,
  EnterSeedphraseDeviceGraphics,
  EnterWalletNameDeviceGraphics,
  GenerateNewWalletDeviceGraphics,
  GuidedFlowDialogBox,
  Image,
  MessageBoxType,
  SelectSeedphraseWordCountDeviceGraphics,
  VerifyPinDeviceGraphics,
  VerifySeedphraseDeviceGraphics,
  Video,
  distributeToLocationsAnimationVideo,
  enterSeedphraseAnimationVideo,
  successIcon,
  tapAllCardDeviceAnimation2DVideo,
  ImportWalletNewUser,
  SettingsDevice,
  RestoreWallets,
  ConfirmTransferDeviceGraphics,
  EnterPin,
  ClearDeviceData,
  MainMenu,
  ViewSeed,
  Restore,
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

import { addKeyboardEvents, useStateWithRef } from '~/hooks';

import {
  GuidedFlowType,
  WalletTransferFlowLostVaultType,
  WalletTransferFlowType,
  WalletTransferLostCardsFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '../../..';
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
  onCloseDialog: () => void;
  title: string;
}

export const GuidedFlowContext: Context<GuidedFlowContextInterface> =
  createContext<GuidedFlowContextInterface>({} as GuidedFlowContextInterface);

export interface GuidedFlowContextProviderProps {
  children: ReactNode;
  type:
    | GuidedFlowType
    | WalletTransferFlowType
    | WalletTransferLostCardsFlowType
    | WalletTransferFlowLostVaultType;
}

const successIconReactElement = <Image src={successIcon} alt="device" />;

export const guidedFlowDialogsImages: Record<
  | GuidedFlowType
  | WalletTransferFlowType
  | WalletTransferLostCardsFlowType
  | WalletTransferFlowLostVaultType,
  React.ReactElement[][]
> = {
  createWallet: [
    [
      <ConfirmCreateWalletDeviceGraphics />,
      <GenerateNewWalletDeviceGraphics />,
      <EnterWalletNameDeviceGraphics />,
      <ConfirmWalletNameDeviceGraphics />,
      <ConfirmCreatePinDeviceGraphics />,
      <EnterPinDeviceGraphics />,
      <VerifyPinDeviceGraphics />,
    ],
    [
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
    ],
    [
      successIconReactElement,
      successIconReactElement,
      successIconReactElement,
      <Video
        src={enterSeedphraseAnimationVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      <Video
        src={distributeToLocationsAnimationVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
    ],
  ],
  importWallet: [
    [
      <ConfirmCreateWalletDeviceGraphics />,
      <ConfirmRestoreFromSeedphraseDeviceGraphics />,
      <EnterWalletNameDeviceGraphics />,
      <ConfirmWalletNameDeviceGraphics />,
      <ConfirmCreatePinDeviceGraphics />,
      <EnterPinDeviceGraphics />,
      <VerifyPinDeviceGraphics />,
    ],
    [
      <SelectSeedphraseWordCountDeviceGraphics />,
      <EnterSeedphraseDeviceGraphics />,
      <VerifySeedphraseDeviceGraphics />,
      <Video
        src={tapAllCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
    ],
    [
      successIconReactElement,
      successIconReactElement,
      successIconReactElement,
      <Video
        src={enterSeedphraseAnimationVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
      <Video
        src={distributeToLocationsAnimationVideo}
        autoPlay
        loop
        $width="full"
        $aspectRatio="16/9"
      />,
    ],
  ],
  walletTransfer: [
    [
      <ImportWalletNewUser height={100} />,
      <ImportWalletNewUser height={100} />,
    ],
    [
      <SettingsDevice />,
      <RestoreWallets />,
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
    ],
    [successIconReactElement],
  ],
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
  const [title, setTitle] = useState('');

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
        guidedFlowDialogsImages[type][index],
        tab.pages as any,
        index === 0,
      ),
    }));
    initTabs[initTabs.length - 1].dialogs.push(
      <FinalMessage
        DialogBox={GuidedFlowDialogBox}
        contextHook={useGuidedFlow}
      />,
    );
    setTabs(initTabs);
    setTitle(lang.strings.guidedFlows[type].title);
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
    dispatch(closeDialog('guidedFlow'));
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
    <GuidedFlowContext.Provider value={ctx}>
      {children}
    </GuidedFlowContext.Provider>
  );
};

export function useGuidedFlow(): GuidedFlowContextInterface {
  return useContext(GuidedFlowContext);
}
