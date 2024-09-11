import { ReactNode, useCallback, useState } from 'react';

import { getElementName } from '~/utils';
import logger from '~/utils/logger';

import { DialogName } from '..';

export type ITabs = {
  name: string;
  dialogs: ReactNode[];
  dontShowOnMilestone?: boolean;
}[];

export interface IUseTabsAndDialogs {
  deviceRequiredDialogsMap: Record<number, number[] | undefined>;
  tabs: ITabs;
  dialogName: DialogName;
  defaultTab?: number;
  defaultDialog?: number;
}

export function useTabsAndDialogs({
  deviceRequiredDialogsMap,
  tabs,
  dialogName,
  defaultTab = 0,
  defaultDialog = 0,
}: IUseTabsAndDialogs) {
  const [currentTab, setCurrentTab] = useState<number>(defaultTab);
  const [currentDialog, setCurrentDialog] = useState<number>(defaultDialog);

  const checkIfDeviceRequiredInDialog = useCallback(
    (tab: number, dialog: number) => {
      const deviceRequiredDialogs = deviceRequiredDialogsMap[tab] ?? [];
      if (!deviceRequiredDialogs) return false;

      return deviceRequiredDialogs.includes(dialog);
    },
    [deviceRequiredDialogsMap],
  );

  const [isDeviceRequired, setIsDeviceRequired] = useState<boolean>(
    checkIfDeviceRequiredInDialog(defaultTab, defaultDialog),
  );

  const goTo = useCallback(
    (tab: number, dialog = 0) => {
      const _isDeviceRequired = checkIfDeviceRequiredInDialog(tab, dialog);

      setIsDeviceRequired(_isDeviceRequired);
      setCurrentTab(tab);

      const tabName = tabs[tab].name;
      const subDialogName = getElementName(tabs[tab].dialogs[dialog]);

      logger.info('Dialog: Navigation', {
        source: useTabsAndDialogs.name,
        dialogName,
        tabName,
        subDialogName,
        isDeviceRequired: _isDeviceRequired,
      });

      if (dialog !== undefined) {
        setCurrentDialog(dialog);
      } else {
        setCurrentDialog(0);
      }
    },
    [checkIfDeviceRequiredInDialog, tabs, dialogName],
  );

  const goToNextTab = useCallback(() => {
    const newTab = Math.min(tabs.length - 1, currentTab + 1);

    if (currentTab !== tabs.length - 1) {
      goTo(newTab, 0);
    } else {
      goTo(newTab);
    }

    return newTab;
  }, [currentTab, tabs, goTo]);

  const goToNextDialog = useCallback(() => {
    const nextDialog = Math.min(
      tabs[currentTab].dialogs.length - 1,
      currentDialog + 1,
    );

    goTo(currentTab, nextDialog);
    return nextDialog;
  }, [currentDialog, currentTab, tabs, goTo]);

  const onNext = useCallback((): [number, number] => {
    if (currentDialog + 1 > tabs[currentTab].dialogs.length - 1) {
      const tab = goToNextTab();
      return [tab, 0];
    }
    const dialog = goToNextDialog();
    return [currentTab, dialog];
  }, [currentDialog, currentTab, tabs, goToNextTab, goToNextDialog]);

  const onPrevious = useCallback((): [number, number] => {
    if (currentDialog - 1 < 0) {
      if (currentTab === 0) {
        goTo(currentTab, 0);
        return [currentTab, 0];
      }
      const nextDialog = tabs[currentTab - 1].dialogs.length - 1;
      const nextTab = Math.max(0, currentTab - 1);

      goTo(nextTab, nextDialog);
      return [nextTab, nextDialog];
    }
    const nextDialog = Math.max(0, currentDialog - 1);
    goTo(currentTab, nextDialog);
    return [currentTab, nextDialog];
  }, [currentDialog, currentTab, tabs, goTo]);

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
