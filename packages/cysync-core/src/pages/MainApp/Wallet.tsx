import {
  WalletHeader,
  TableSearch,
  BitcoinCircularBorder,
  Close,
  Paras,
  Flux,
  ArrowRightBottom,
  CypherockWhite,
  Check,
  Throbber,
  UsdcCurency,
  Ethereum1Icon,
  TableStructure,
  TableRow,
  TableHeaderWallet,
  ShowMore,
  BitcoinGray,
  SkeletonLoader,
  NoAccountWrapper,
  NoSearchResult,
  NotFound,
} from '@cypherock/cysync-ui';
import { isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

import { useQuery } from '~/hooks';
import { selectLanguage, selectWallets, useAppSelector } from '~/store';
import { searchFilter, sortData } from '~/utils/sorting';

import { MainAppLayout } from './Components';

interface TokenType {
  leftImage: React.ReactNode;
  arrow?: React.ReactNode;
  text: string;
  tokenAmount: string;
  tokenValue: string;
}

interface DataType {
  arrow?: React.ReactNode;
  leftImage: React.ReactNode;
  text: string;
  subText?: string;
  tag?: string;
  statusImage: React.ReactNode;
  tokenAmount: string;
  tokenValue: string;
  tokens?: TokenType[];
}

const data: DataType[] = [
  {
    leftImage: <Ethereum1Icon />,
    text: 'Ethereum',
    subText: 'Ethereum',
    statusImage: <Check width={25} height={20} />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
    tokens: [
      {
        arrow: <ArrowRightBottom />,
        leftImage: <UsdcCurency />,
        text: 'USD Coin',
        tokenAmount: '25.324623748523423748237942324783 USDC',
        tokenValue: '$23.267',
      },
      {
        leftImage: <UsdcCurency />,
        text: 'Something Else Coin',
        tokenAmount: '106.225 USDC',
        tokenValue: '$123.387',
      },
      {
        leftImage: <UsdcCurency />,
        text: 'Something Else Coin',
        tokenAmount: '106.225 USDC',
        tokenValue: '$123.387',
      },
      {
        leftImage: <UsdcCurency />,
        text: 'Something Else Coin',
        tokenAmount: '106.225 USDC',
        tokenValue: '$123.387',
      },
      {
        leftImage: <UsdcCurency />,
        text: 'Something Else Coin',
        tokenAmount: '106.225 USDC',
        tokenValue: '$123.387',
      },
      {
        leftImage: <UsdcCurency />,
        text: 'Something Else Coin husdtysaud qp31uosadasd sdasd',
        tokenAmount: '106.225 USDC',
        tokenValue: '$123.387',
      },
      {
        leftImage: <UsdcCurency />,
        text: 'Something Else Coin',
        tokenAmount: '106.225 USDC',
        tokenValue: '$123.387',
      },
    ],
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin 1',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Throbber size={20} strokeWidth={2} />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
  {
    leftImage: <CypherockWhite />,
    text: 'cypherock.near',
    subText: 'NEAR',
    statusImage: <Check width={25} height={20} />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
    tokens: [
      {
        arrow: <ArrowRightBottom />,
        leftImage: <Flux />,
        text: 'Flux',
        tokenAmount: '25.783 FLUX',
        tokenValue: '$23.267',
      },
      {
        leftImage: <Paras />,
        text: 'Paras',
        tokenAmount: '106.225 PARAS',
        tokenValue: '$123.973',
      },
    ],
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin 2',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Close />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin Official',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Check />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin Business',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Check />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin Official',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Check />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin 2',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Close />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
  {
    leftImage: <BitcoinCircularBorder />,
    text: 'Bitcoin 2',
    subText: 'BITCOIN',
    tag: 'Taproot',
    statusImage: <Close />,
    tokenAmount: '0.00007 BTC',
    tokenValue: '$2.387',
  },
];

const skeletonData = {
  loader: <BitcoinGray />,
  text: 'No Account yet',
  subText: 'No coins/accounts were found in the wallet',
};

const dropDownData = [
  {
    id: '41',
    text: 'Bitcoin',
    checkType: 'radio',
    tag: 'Taproot',
  },
  {
    id: '42',
    text: 'Ethereum',
    checkType: 'radio',
  },
  {
    id: '43',
    text: 'Solana',
    checkType: 'radio',
  },
  {
    id: '44',
    text: 'Binance Smart Chain',
    checkType: 'radio',
  },
];

export const Wallet: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);
  const query = useQuery();
  const breadcrumb = 'Cypherock Red';
  const ITEMS_PER_PAGE = 5;
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedData, setDisplayedData] = useState<DataType[]>(data);
  const [resultsFound, setResultsFound] = useState<boolean>(true);
  const [sortKey, setSortKey] = useState<keyof DataType | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleShowMore = () => {
    if (showMoreClicked) {
      setItemsToShow(ITEMS_PER_PAGE);
    } else {
      setItemsToShow(itemsToShow + ITEMS_PER_PAGE);
    }
    setShowMoreClicked(!showMoreClicked);
  };

  const walletName = wallets.find(
    wallet => wallet.__id === query.get('id'),
  )?.name;

  useEffect(() => {
    if (sortKey !== null) {
      const sortedDataArray = sortData([...data], sortKey, sortDirection);
      if (!isEqual(sortedDataArray, displayedData)) {
        setDisplayedData(sortedDataArray);
      }
    }
  }, [sortKey, sortDirection]);

  const filterData = () => {
    const filteredData = searchFilter(data, searchTerm);
    setDisplayedData(filteredData);
    setResultsFound(filteredData.length > 0);
  };

  const onPostfixIconClick = () => {
    console.log('onPostfixIconClick', searchTerm);
    setSearchTerm('');
  };

  const setSearchValue = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    filterData();
    console.log('This is getting printed after clearing inpiut');
  }, [searchTerm]);

  const onSort = (key: keyof DataType, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const slicedData = displayedData.slice(0, itemsToShow);
  const MAIN_ITEM_HEIGHT = 160;
  const totalHeight = ITEMS_PER_PAGE * MAIN_ITEM_HEIGHT;

  return (
    <MainAppLayout title={`${lang.strings.wallet.title} ${walletName}`}>
      {data.length > 0 ? (
        <>
          <WalletHeader
            title={`${lang.strings.wallet.title}`}
            breadcrumb={breadcrumb}
            btnAddToken={lang.strings.wallet.cypherock.buttons.addToken}
            btnAddAccount={lang.strings.wallet.cypherock.buttons.addAccount}
            dropdown={dropDownData}
          />
          <TableStructure $totalHeight={totalHeight}>
            <TableSearch
              onSearch={setSearchValue}
              $borderGold={!resultsFound}
              onPostfixIconClick={onPostfixIconClick}
            />
            {slicedData.length > 0 ? (
              <>
                <TableHeaderWallet lang={lang} onSort={onSort} />
                {slicedData.map((row, index) => (
                  <TableRow
                    key={`row-${index + 1}`}
                    leftImage={row.leftImage}
                    text={row.text}
                    subText={row.subText}
                    tag={row.tag}
                    statusImage={row.statusImage}
                    tokenAmount={row.tokenAmount}
                    tokenValue={row.tokenValue}
                    tokens={row.tokens}
                    $rowIndex={index}
                    $hide={lang.strings.wallet.cypherock.buttons.hide}
                    $show={lang.strings.wallet.cypherock.buttons.show}
                    $balance
                  />
                ))}
                <ShowMore
                  showMoreClicked={showMoreClicked}
                  handleShowMore={handleShowMore}
                  less={lang.strings.wallet.cypherock.buttons.less}
                  more={lang.strings.wallet.cypherock.buttons.more}
                />
              </>
            ) : (
              <NoSearchResult
                image={<NotFound />}
                text={lang.strings.wallet.cypherock.search.text}
                subText={lang.strings.wallet.cypherock.search.subText}
                searchText={searchTerm}
              />
            )}
          </TableStructure>
        </>
      ) : (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={skeletonData.loader}
            text={skeletonData.text}
            subText={skeletonData.subText}
            $buttonOne={lang.strings.wallet.cypherock.buttons.addToken}
            $buttonTwo={lang.strings.wallet.cypherock.buttons.addCoinToken}
          />
        </NoAccountWrapper>
      )}
    </MainAppLayout>
  );
};
