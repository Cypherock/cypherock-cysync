import {
  InlineDropdown,
  DownloadCSVButtonStyle,
  DropDownItemProps,
  FilterIcon,
  Tooltip,
  useTheme,
} from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { CoinIcon } from './CoinIcon';

import {
  selectAccounts,
  selectLanguage,
  selectWallets,
  useAppSelector,
} from '~/store';

interface HistoryFilterProps {
  selectedWalletIds: string[];
  selectedAccountIds: string[];
  setSelectedWalletIds: (ids: string[]) => void;
  setSelectedAccountIds: (ids: string[]) => void;
}

const PopoverContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 70vh;
  overflow-y: auto;
  z-index: 20;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.border.popup};
  box-shadow: ${({ theme }) => theme.shadow.popup};
`;

const FilterButtonWrapper = styled.div`
  position: relative;
`;

const ActiveDot = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.golden};
`;

export const HistoryFilter: React.FC<HistoryFilterProps> = ({
  selectedWalletIds,
  selectedAccountIds,
  setSelectedWalletIds,
  setSelectedAccountIds,
}) => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);
  const { accounts } = useAppSelector(selectAccounts);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const historyStrings = lang.strings.history;

  const walletItems: DropDownItemProps[] = useMemo(
    () =>
      wallets.map(w => ({
        id: w.__id ?? '',
        text: w.name,
      })),
    [wallets],
  );

  const accountsForSelectedWallets = useMemo<IAccount[]>(() => {
    if (selectedWalletIds.length === 0) return [];
    const walletIdSet = new Set(selectedWalletIds);
    return accounts.filter(a => walletIdSet.has(a.walletId) && !a.isHidden);
  }, [accounts, selectedWalletIds]);

  const accountItems: DropDownItemProps[] = useMemo(() => {
    const list: DropDownItemProps[] = [];
    const mainAccounts = accountsForSelectedWallets.filter(
      a => a.type === AccountTypeMap.account,
    );

    for (const account of mainAccounts) {
      list.push({
        id: account.__id ?? '',
        text: account.name,
        tag: lodash.upperCase(account.derivationScheme),
        leftImage: (
          <CoinIcon
            parentAssetId={account.parentAssetId}
            assetId={account.assetId}
          />
        ),
      });

      const subAccounts = accountsForSelectedWallets.filter(
        sub => sub.parentAccountId === account.__id,
      );
      for (const subAccount of subAccounts) {
        list.push({
          id: subAccount.__id ?? '',
          text: subAccount.name,
          leftImage: (
            <CoinIcon
              parentAssetId={subAccount.parentAssetId}
              assetId={subAccount.assetId}
            />
          ),
          $parentId: account.__id,
        });
      }
    }

    return list;
  }, [accountsForSelectedWallets]);

  useEffect(() => {
    if (selectedAccountIds.length === 0) return;
    const validAccountIds = new Set(
      accountsForSelectedWallets.map(a => a.__id ?? ''),
    );
    const filtered = selectedAccountIds.filter(id => validAccountIds.has(id));
    if (filtered.length !== selectedAccountIds.length) {
      setSelectedAccountIds(filtered);
    }
  }, [accountsForSelectedWallets]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  const activeCount = selectedWalletIds.length + selectedAccountIds.length;

  return (
    <FilterButtonWrapper ref={containerRef}>
      <Tooltip text={lang.strings.tooltips.filter} tooltipPlacement="bottom">
        <DownloadCSVButtonStyle onClick={toggleOpen}>
          <FilterIcon fill={theme.palette.text.white} />
          {activeCount > 0 && <ActiveDot />}
        </DownloadCSVButtonStyle>
      </Tooltip>
      {isOpen && (
        <PopoverContainer>
          <InlineDropdown
            label={historyStrings.filter.wallets}
            items={walletItems}
            selectedIds={selectedWalletIds}
            onChange={setSelectedWalletIds}
            $itemLeftPadding="48px"
          />
          {selectedWalletIds.length > 0 && (
            <InlineDropdown
              label={historyStrings.filter.accounts}
              items={accountItems}
              selectedIds={selectedAccountIds}
              onChange={setSelectedAccountIds}
              showSearch
              searchPlaceholder={historyStrings.search.placeholder}
              noDataText={historyStrings.search.notFound.text}
              $maxBodyHeight={320}
              $itemLeftPadding="48px"
              $nestedItemLeftPadding="78px"
            />
          )}
        </PopoverContainer>
      )}
    </FilterButtonWrapper>
  );
};
