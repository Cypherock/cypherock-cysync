import {
  SideBarState as State,
  ThemeType,
  useTheme,
} from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { openContactSupportDialog } from '~/actions';
import { useMemoReturn, useNavigateTo, useQuery, useWalletSync } from '~/hooks';
import logger from '~/utils/logger';

import {
  AppDispatch,
  ILangState,
  constants,
  routes,
  selectLanguage,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '..';

export type Page =
  | 'portfolio'
  | 'wallet'
  | 'inheritance'
  | 'history'
  | 'settings'
  | 'help'
  | 'tutorial'
  | 'swap'
  | 'buysell';

export interface SidebarContextInterface {
  strings: ILangState['strings']['sidebar'];
  getState: (page: Page) => State;
  navigate: (page: Page) => void;
  theme: ThemeType;
  isWalletCollapsed: boolean;
  setIsWalletCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  navigateWallet: (id: string | undefined) => void;
  getWalletState: (id: string | undefined) => State;
  syncWalletStatus: string;
  wallets: IWallet[];
  deletedWallets: IWallet[];
  onWalletSync: (e: any) => void;
  dispatch: AppDispatch;
  isWalletPage: boolean;
  width: number;
  startDrag: () => void;
  isDragging: boolean;
}

export const SidebarContext: React.Context<SidebarContextInterface> =
  React.createContext<SidebarContextInterface>({} as SidebarContextInterface);

export interface SidebarProviderProps {
  children: React.ReactNode;
}

const DEFAULT_SIDEBAR_WIDTH = 312;
const MIN_SIDEBAR_WIDTH = 190;

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const query = useQuery();
  const dispatch = useAppDispatch();
  const strings = useAppSelector(selectLanguage).strings.sidebar;
  const { wallets, deletedWallets, syncWalletStatus } =
    useAppSelector(selectWallets);
  const theme = useTheme();
  const navigateTo = useNavigateTo();
  const { onWalletSync } = useWalletSync();

  const [isWalletCollapsed, setIsWalletCollapsed] = React.useState(false);
  const [width, setWidth] = React.useState(DEFAULT_SIDEBAR_WIDTH);
  const [isDragging, setIsDragging] = React.useState(false);

  const minWidth = MIN_SIDEBAR_WIDTH;
  const maxWidth = DEFAULT_SIDEBAR_WIDTH;

  const startDrag = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const onMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX;
      const newWidth = Math.min(Math.max(mouseX, minWidth), maxWidth);
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    logger.info('Route Change', location);
  }, [location.pathname, location.search, location.hash]);

  const navigate = (page: Page) => {
    if (page === 'tutorial') {
      window.open(constants.tutorialLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (page === 'help') {
      dispatch(openContactSupportDialog());
      return;
    }
    if (page === 'inheritance') {
      navigateTo(routes[page].home.path);
      return;
    }
    navigateTo(routes[page].path);
  };

  const navigateWallet = (id: string | undefined) => {
    if (!id) return;
    navigateTo(`${routes.wallet.path}?id=${id}`);
  };

  const getState = (page: Page): State => {
    if (page === 'help') return State.normal;
    if (page === 'tutorial') return State.normal;
    const path =
      page === 'inheritance' ? routes[page].home.path : routes[page].path;

    if (location.pathname.startsWith(path)) return State.selected;
    return State.normal;
  };

  const getWalletState = (id: string | undefined): State => {
    if (
      (id &&
        location.pathname === routes.wallet.path &&
        query.get('id') === id) ||
      (id &&
        location.pathname === routes.account.path &&
        query.get('fromWalletId') === id)
    )
      return State.active;
    return State.normal;
  };

  useEffect(() => {
    if (location.pathname === routes.wallet.path) {
      setIsWalletCollapsed(false);
    }
  }, [location.pathname]);

  const ctx = useMemoReturn({
    strings,
    getState,
    navigate,
    theme,
    isWalletCollapsed,
    setIsWalletCollapsed,
    syncWalletStatus,
    wallets,
    onWalletSync,
    deletedWallets,
    navigateWallet,
    getWalletState,
    dispatch,
    isWalletPage: location.pathname === routes.wallet.path,
    width,
    startDrag,
    isDragging,
  });

  return (
    <SidebarContext.Provider value={ctx}>{children}</SidebarContext.Provider>
  );
};

export function useSidebar(): SidebarContextInterface {
  return React.useContext(SidebarContext);
}
