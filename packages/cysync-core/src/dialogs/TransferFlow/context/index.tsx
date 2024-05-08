// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ConfirmTransferDeviceGraphics,
  EnterPinDeviceGraphics,
  Image,
  ImportWalletNewUser,
  MessageBoxType,
  RestoreWallets,
  SettingsDevice,
  Video,
  WalletTransferFlowDialogBox,
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

import { openTransferLessCardsFlowDialog } from '~/actions';
import { addKeyboardEvents, useStateWithRef } from '~/hooks';

import {
  TransferFlowType,
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

export interface TransferFlowContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: (data: number) => void;
  currentDialog: number;
  setCurrentDialog: (data: number) => void;
  onNext: () => void;
  onSelect: () => void;
  changeCondition?: () => void;
  onPrevious: () => void;
  blastConfetti: boolean;
  showBackButton: boolean;
  onCloseDialog: () => void;
  title: string;
}

export const TransferFlowContext: Context<TransferFlowContextInterface> =
  createContext<TransferFlowContextInterface>(
    {} as TransferFlowContextInterface,
  );

export interface TransferFlowContextProviderProps {
  children: ReactNode;
  type: TransferFlowType;
}

const successIconReactElement = <Image src={successIcon} alt="device" />;

const dialogsImages: Record<TransferFlowType, React.ReactElement[][]> = {
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
      <EnterPinDeviceGraphics />,
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
};

interface ITransferDialogContent {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
}

export const TransferFlowProvider: FC<TransferFlowContextProviderProps> = ({
  children,
  type,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [tabs, setTabs, tabsRef] = useStateWithRef<ITabs>([]);
  const getInitialDialogValue = () =>
    window.location.hash === '#/settings' ? 1 : 0;
  const [currentTab, setCurrentTab, tabRef] = useStateWithRef(
    getInitialDialogValue(),
  );
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
    if (
      window.location.hash === '#/portfolio' &&
      tabRef.current === 0 &&
      currentTab === 0 &&
      currentDialog === 0
    ) {
      return;
    }
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

  const onSelect = () => {
    setCurrentTab(1);
  };

  const changeCondition = () => {
    dispatch(closeDialog('transferFlow'));
    dispatch(openTransferLessCardsFlowDialog('walletTransferLessCards'));
  };

  const onPrevious = () => {
    if (
      window.location.hash === '#/portfolio' &&
      tabRef.current === 1 &&
      currentTab === 1 &&
      currentDialog === 0
    ) {
      if (tabRef.current > 0) {
        setCurrentTab(tabRef.current - 1);
        setCurrentDialog(
          tabsRef.current[tabRef.current - 1].dialogs.length - 1,
        );
      }
      return;
    }

    if (
      window.location.hash === '#/portfolio' &&
      tabRef.current === 0 &&
      currentTab === 0 &&
      currentDialog === 0
    ) {
      return;
    }
    if (
      window.location.hash === '#/settings' &&
      currentTab === 1 &&
      dialogRef.current === 0 &&
      tabRef.current === 1
    ) {
      return;
    }
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
      <WalletTransferFlowDialogBox
        key={`${index + 1}`}
        image={images[index]}
        {...content}
        onNext={onNext}
        onPrevious={onPrevious}
        disablePrev={first && index === 0}
        changeCondition={changeCondition}
        onSelect={onSelect}
        lang={lang}
      />
    ));

  const init = () => {
    let initTabs = [];

    if (currentTab === 0) {
      const firstTabData = lang.strings.guidedFlows[type].tabs[0];
      initTabs.push({
        name: firstTabData.asideTitle,
        dialogs: getDialogArray(
          dialogsImages[type][0],
          firstTabData.pages as any,
          true,
        ),
      });
    } else {
      initTabs = lang.strings.guidedFlows[type].tabs.map((tab, index) => ({
        name: tab.asideTitle,
        dialogs: getDialogArray(
          dialogsImages[type][index],
          tab.pages as any,
          index === 0,
        ),
      }));
    }

    initTabs[initTabs.length - 1].dialogs.push(<FinalMessage />);
    setTabs(initTabs);
    setTitle(lang.strings.guidedFlows[type].title);
  };

  useEffect(() => {
    init();
  }, [currentTab]);

  useEffect(() => {
    setBlastConfetti(
      !isConfettiBlastDone && currentTab === 2 && currentDialog === 0,
    );
    setShowBackButton(currentTab === 0 && currentDialog === 0);
  }, [currentTab, currentDialog]);

  const onCloseDialog = () => {
    setCurrentTab(0);
    setCurrentDialog(0);
    dispatch(closeDialog('transferFlow'));
  };

  const ctx = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      changeCondition,
      onSelect,
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
      onSelect,
      changeCondition,
      onPrevious,
      blastConfetti,
      showBackButton,
      onCloseDialog,
      title,
    ],
  );

  return (
    <TransferFlowContext.Provider value={ctx}>
      {children}
    </TransferFlowContext.Provider>
  );
};

export function useTransferFlow(): TransferFlowContextInterface {
  return useContext(TransferFlowContext);
}
