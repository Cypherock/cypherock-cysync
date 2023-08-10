import { ReactNode, useState } from 'react';

export type ITabs = {
  name: string;
  dialogs: ReactNode[];
  dontShowOnMilestone?: boolean;
}[];

export interface IUseTabsAndDialogs {
  deviceRequiredDialogsMap: Record<number, number[] | undefined>;
  tabs: ITabs;
}

export function useTabsAndDialogs({
  deviceRequiredDialogsMap,
  tabs,
}: IUseTabsAndDialogs) {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<number>(0);
  const [isDeviceRequired, setIsDeviceRequired] = useState<boolean>(false);

  const onNext = () => {
    if (currentDialog + 1 > tabs[currentTab].dialogs.length - 1) {
      goToNextTab();
    } else {
      goToNextDialog();
    }
  };

  const goToNextTab = () => {
    const newTab = Math.min(tabs.length - 1, currentTab + 1);

    if (currentTab !== tabs.length - 1) {
      goTo(newTab, 0);
    } else {
      goTo(newTab);
    }
  };

  const goToNextDialog = () => {
    const nextDialog = Math.min(
      tabs[currentTab].dialogs.length - 1,
      currentDialog + 1,
    );

    goTo(currentTab, nextDialog);
  };

  const checkIfDeviceRequiredInDialog = (tab: number, dialog: number) => {
    const deviceRequiredDialogs = deviceRequiredDialogsMap[tab] ?? [];
    if (!deviceRequiredDialogs) return false;

    return deviceRequiredDialogs.includes(dialog);
  };

  const goTo = (tab: number, dialog?: number) => {
    setIsDeviceRequired(checkIfDeviceRequiredInDialog(tab, dialog ?? 0));
    setCurrentTab(tab);

    if (dialog !== undefined) {
      setCurrentDialog(dialog);
    } else {
      setCurrentDialog(0);
    }
  };

  const onPrevious = () => {
    if (currentDialog - 1 < 0) {
      if (currentTab === 0) {
        goTo(currentTab, 0);
      } else {
        const nextDialog = tabs[currentTab - 1].dialogs.length - 1;
        const nextTab = Math.max(0, currentTab - 1);

        goTo(nextTab, nextDialog);
      }
    } else {
      const nextDialog = Math.max(0, currentDialog - 1);
      goTo(currentTab, nextDialog);
    }
  };

  return {
    onNext,
    onPrevious,
    goTo,
    goToNextTab,
    goToNextDialog,
    currentTab,
    currentDialog,
    isDeviceRequired,
  };
}
