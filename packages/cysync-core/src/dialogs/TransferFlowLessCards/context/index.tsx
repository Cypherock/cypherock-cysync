// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ClearDeviceData,
  ConfirmCreatePinDeviceGraphics,
  ConfirmCreateWalletDeviceGraphics,
  ConfirmRestoreFromSeedphraseDeviceGraphics,
  ConfirmTransferDeviceGraphics,
  ConfirmWalletNameDeviceGraphics,
  EnterPinDeviceGraphics,
  EnterSeedphraseDeviceGraphics,
  EnterWalletNameDeviceGraphics,
  Image,
  MessageBoxType,
  SelectSeedphraseWordCountDeviceGraphics,
  SettingsDevice,
  VerifyPinDeviceGraphics,
  VerifySeedphraseDeviceGraphics,
  Video,
  WalletTransferLessCardsFlowDialogBox,
  distributeToLocationsAnimationVideo,
  enterSeedphraseAnimationVideo,
  successIcon,
  tapAllCardDeviceAnimation2DVideo,
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

import { openTransferFlowDialog } from '~/actions';
import { addKeyboardEvents, useStateWithRef } from '~/hooks';

import {
  TransferLessCardsFlowType,
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

export interface TransferLessCardsFlowContextInterface {
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

export const TransferLessCardsFlowContext: Context<TransferLessCardsFlowContextInterface> =
  createContext<TransferLessCardsFlowContextInterface>(
    {} as TransferLessCardsFlowContextInterface,
  );

export interface TransferLessCardsFlowContextProviderProps {
  children: ReactNode;
  type: TransferLessCardsFlowType;
}

const successIconReactElement = <Image src={successIcon} alt="device" />;

const dialogsImages: Record<TransferLessCardsFlowType, React.ReactElement[][]> =
  {
    walletTransferLessCards: [
      [],
      [
        <SettingsDevice />,
        <ClearDeviceData />,
        <ClearDeviceData />,
        successIconReactElement,
        <Video
          src={tapAllCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width="full"
          $aspectRatio="16/9"
        />,
        successIconReactElement,
        <ConfirmTransferDeviceGraphics />,
        <ConfirmTransferDeviceGraphics />,
        <ConfirmTransferDeviceGraphics />,
        <Video
          src={tapAllCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width="full"
          $aspectRatio="16/9"
        />,
        <ConfirmTransferDeviceGraphics />,
        <EnterPinDeviceGraphics />,
        <Video
          src={tapAllCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width="full"
          $aspectRatio="16/9"
        />,
        successIconReactElement,
        <ConfirmTransferDeviceGraphics />,
        <ConfirmTransferDeviceGraphics />,
        <ConfirmCreatePinDeviceGraphics />,
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
        <ClearDeviceData />,
        <Video
          src={tapAllCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width="full"
          $aspectRatio="16/9"
        />,
        successIconReactElement,
        <Video
          src={tapAllCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width="full"
          $aspectRatio="16/9"
        />,
        successIconReactElement,
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
  };

interface ITransferDialogContent {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
}

export const TransferLessCardsFlowProvider: FC<
  TransferLessCardsFlowContextProviderProps
> = ({ children, type }) => {
  const lang = useAppSelector(selectLanguage);
  const [tabs, setTabs, tabsRef] = useStateWithRef<ITabs>([]);
  const [currentTab, setCurrentTab, tabRef] = useStateWithRef(1);
  const [currentDialog, setCurrentDialog, dialogRef] = useStateWithRef(0);
  const [isConfettiBlastDone, setIsConfettiBlastDone] = useState(false);
  const [blastConfetti, setBlastConfetti] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState('');

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

  const onPrevious = () => {
    checkConfettiBlastDone();
    if (tabRef.current === 1 && dialogRef.current === 0) {
      dispatch(openTransferFlowDialog('walletTransfer'));
      dispatch(closeDialog('transferLessCardsFlow'));
    } else {
      checkConfettiBlastDone();
      if (dialogRef.current - 1 < 0) {
        if (tabRef.current > 1) {
          // Adjusted to ensure we're navigating within bounds
          setCurrentDialog(
            tabsRef.current[tabRef.current - 1].dialogs.length - 1,
          );
          setCurrentTab(Math.max(1, tabRef.current - 1));
        } else {
          // This condition is met if we're already at the first dialog of the first tab,
          // so you might not need to do anything here or adjust based on your flow.
          // setCurrentDialog(0); // Potentially redundant
        }
      } else {
        setCurrentDialog(Math.max(0, dialogRef.current - 1));
      }
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
      <WalletTransferLessCardsFlowDialogBox
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
    setTitle(lang.strings.guidedFlows[type].title);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const shouldBlastConfetti =
      (isConfettiBlastDone && currentTab === 1 && currentDialog === 13) ||
      (currentTab === 3 && currentDialog === 0);

    setBlastConfetti(shouldBlastConfetti);

    setShowBackButton(currentTab === 0 && currentDialog === 0);
  }, [currentTab, currentDialog]);

  const onCloseDialog = () => {
    setCurrentTab(0);
    setCurrentDialog(0);
    dispatch(closeDialog('transferLessCardsFlow'));
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
    <TransferLessCardsFlowContext.Provider value={ctx}>
      {children}
    </TransferLessCardsFlowContext.Provider>
  );
};

export function useTransferFlow(): TransferLessCardsFlowContextInterface {
  return useContext(TransferLessCardsFlowContext);
}
