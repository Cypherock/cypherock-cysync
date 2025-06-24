import {
  SideBarState as State,
  ThemeType,
  useTheme,
} from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';

import { openContactSupportDialog } from '~/actions';
import { useMemoReturn, useNavigateTo, useQuery, useWalletSync } from '~/hooks';
import logger from '~/utils/logger';

import {
  AppDispatch,
  ILangState,
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
  | 'referAndEarn'
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
}

export const SidebarContext: Context<SidebarContextInterface> =
  createContext<SidebarContextInterface>({} as SidebarContextInterface);

export interface SidebarProviderProps {
  children: ReactNode;
}

const DEFAULT_SIDEBAR_WIDTH = 312;
const MIN_SIDEBAR_WIDTH = 190;

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
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
    if (!isDragging) {
      document.body.style.cursor = '';
      return undefined;
    }

    document.body.style.cursor = 'ew-resize';

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
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  useEffect(() => {
    logger.info('Route Change', location);
  }, [location.pathname, location.search, location.hash]);

  const navigate = (page: Page) => {
    if (page === 'help') {
      dispatch(openContactSupportDialog());
      return;
    }
    if (page === 'inheritance') {
      navigateTo(routes[page].home.path);
      return;
    }

    if (page === 'referAndEarn') {
      navigateTo(routes.referAndEarn.path);
      return;
    }
    navigateTo(routes[page].path);
  };

  const navigateWallet = (id: string | undefined) => {
    if (!id) return;
    navigateTo(`${routes.wallet.path}?id=${id}`);
  };

  const getState = (page: Page): State => {
    if (page === 'help') {
      return State.normal;
    }

    let path: string;
    switch (page) {
      case 'inheritance':
        path = routes.inheritance.home.path;
        break;
      case 'referAndEarn':
        path = routes.referAndEarn.path;
        break;
      default:
        path = routes[page].path;
    }

    return location.pathname.startsWith(path) ? State.selected : State.normal;
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
  });

  return (
    <SidebarContext.Provider value={ctx}>{children}</SidebarContext.Provider>
  );
};

export function useSidebar(): SidebarContextInterface {
  return useContext(SidebarContext);
}
