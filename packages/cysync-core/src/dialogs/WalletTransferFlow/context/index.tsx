// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ConfirmTransferDeviceGraphics,
  EnterPin,
  Image,
  ImportWalletNewUser,
  MessageBoxType,
  RestoreWallets,
  SettingsDevice,
  Video,
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

import { openWalletTransferLostCardsFlowDialog } from '~/actions';
import { FinalMessage } from '~/dialogs/GuidedFlow/Dialogs/FinalMessage';
import { addKeyboardEvents, useStateWithRef } from '~/hooks';

import {
  WalletTransferFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '../../..';
import { WalletTransferFlowDialogBox } from '~/dialogs/WalletTransferFlowDialogBox';
import { WalletTransferLostCardsFlowDialogBox } from '~/dialogs/WalletTransferLostCardsFlowDialogBox';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface WalletTransferFlowContextInterface {
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

export const WalletTransferFlowContext: Context<WalletTransferFlowContextInterface> =
  createContext<WalletTransferFlowContextInterface>(
    {} as WalletTransferFlowContextInterface,
  );

export interface WalletTransferFlowContextProviderProps {
  children: ReactNode;
  type: WalletTransferFlowType;
}

const successIconReactElement = <Image src={successIcon} alt="device" />;

const dialogsImages: Record<WalletTransferFlowType, React.ReactElement[][]> = {
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
};

interface ITransferDialogContent {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
}

export const WalletTransferFlowProvider: FC<
  WalletTransferFlowContextProviderProps
> = ({ children, type }) => {
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
  const displayText = lang.strings.guidedFlows[type];

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
    dispatch(closeDialog('walletTransferFlow'));
    dispatch(openWalletTransferLostCardsFlowDialog('walletTransferLostCards'));
  };

  const onPrevious = () => {
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
      const firstTabData = displayText.tabs[0];
      initTabs.push({
        name: firstTabData.asideTitle,
        dialogs: getDialogArray(
          dialogsImages[type][0],
          firstTabData.pages as any,
          true,
        ),
      });
    } else {
      initTabs = displayText.tabs.map(
        (tab: { asideTitle: any; pages: any }, index: number) => ({
          name: tab.asideTitle,
          dialogs: getDialogArray(
            dialogsImages[type][index],
            tab.pages as any,
            index === 0,
          ),
        }),
      );
    }

    initTabs[initTabs.length - 1].dialogs.push(
      <FinalMessage
        DialogBox={WalletTransferLostCardsFlowDialogBox}
        contextHook={useWalletTransferFlow}
      />,
    );
    setTabs(initTabs);
    setTitle(displayText.title);
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
    dispatch(closeDialog('walletTransferFlow'));
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
    <WalletTransferFlowContext.Provider value={ctx}>
      {children}
    </WalletTransferFlowContext.Provider>
  );
};

export function useWalletTransferFlow(): WalletTransferFlowContextInterface {
  return useContext(WalletTransferFlowContext);
}
