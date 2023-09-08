import React, { FC, useState } from 'react';

import { Filter } from './Filter';
import { FilterMenuDesign } from './FilterMenuDesign';
import {
  FilterItemWrapper,
  FilterLayout,
  FilterMenuWrapper,
} from './FilterStyles';

import {
  BinanceIcon,
  BitcoinIcon,
  EthereumIcon,
  SolanaIcon,
} from '../../../assets';

const data = [
  {
    name: 'Wallets',
    subArray: [
      {
        checkType: 'checkbox',
        name: 'OfficialWallet',
      },
      {
        checkType: 'checkbox',
        name: 'Home',
      },
      {
        checkType: 'checkbox',
        name: 'Work',
      },
      {
        checkType: 'checkbox',
        name: 'Kids',
      },
    ],
  },
  {
    name: 'Accounts',
    subArray: [
      {
        checkType: 'checkbox',
        icon: <EthereumIcon width={16} height={16} />,
        name: 'Ethereum 1 (ETH)',
      },
      {
        checkType: 'checkbox',
        icon: <SolanaIcon width={16} height={16} />,
        name: 'Solana 1 (SOL)',
      },
      {
        checkType: 'checkbox',
        icon: <BitcoinIcon width={16} height={16} />,
        name: 'Bitcoin 1',
        tag: 'Taproot',
      },
      {
        checkType: 'checkbox',
        icon: <BinanceIcon width={16} height={16} />,
        name: 'Binance 1',
      },
      {
        checkType: 'checkbox',
        icon: <EthereumIcon width={16} height={16} />,
        name: 'Ethereum 2 (ETH)',
      },
      {
        checkType: 'checkbox',
        icon: <SolanaIcon width={16} height={16} />,
        name: 'Solana 2 (SOL)',
      },
      {
        checkType: 'checkbox',
        icon: <BitcoinIcon width={16} height={16} />,
        name: 'Bitcoin 2',
        tag: 'Taproot',
      },
      {
        checkType: 'checkbox',
        icon: <BinanceIcon width={16} height={16} />,
        name: 'Binance 2',
      },
    ],
  },
  {
    name: 'Group By',
    subArray: [
      {
        checkType: 'checkbox',
        name: 'Time',
      },
      {
        checkType: 'checkbox',
        name: 'Chains',
      },
      {
        checkType: 'checkbox',
        name: 'Collections',
      },
      {
        checkType: 'checkbox',
        name: 'Accounts',
      },
      {
        checkType: 'checkbox',
        name: 'Wallets',
      },
    ],
  },
];

export const FilterDropdown: FC = () => {
  const [filterStates, setFilterStates] = useState(data.map(() => false));
  const [isOpen, setIsOpen] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(
    data.map(menu => menu.subArray.map(() => false)),
  );

  const handleCheckboxChange = (menuIndex: number, subMenuIndex: number) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[menuIndex][subMenuIndex] =
      !newCheckboxStates[menuIndex][subMenuIndex];
    setCheckboxStates(newCheckboxStates);
  };

  const handleToggleAllCheckboxes = (menuIndex: number) => {
    const newCheckboxStates = [...checkboxStates];
    const allChecked = newCheckboxStates[menuIndex].every(Boolean);
    newCheckboxStates[menuIndex] = newCheckboxStates[menuIndex].map(
      () => !allChecked,
    );
    setCheckboxStates(newCheckboxStates);
  };

  const handleFilterToggle = (index: number) => {
    const newFilterStates = [...filterStates];
    newFilterStates[index] = !newFilterStates[index];
    setFilterStates(newFilterStates);
  };

  const selectedCounts = checkboxStates.map(
    subArray => subArray.filter(Boolean).length,
  );
  const countMenuSelected = selectedCounts.filter(count => count > 0).length;

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <FilterMenuWrapper>
      <FilterMenuDesign
        countMenuSelected={countMenuSelected}
        onClick={handleFilterClick}
      />
      {isOpen && (
        <FilterItemWrapper>
          <FilterLayout>
            {data.map((item, index) => {
              const selectedCount =
                checkboxStates[index].filter(Boolean).length;
              return (
                <Filter
                  key={`filter-${index + 1}`}
                  menu={item.name}
                  subMenu={item.subArray}
                  isToggled={filterStates[index]}
                  onToggle={() => handleFilterToggle(index)}
                  checkboxStates={checkboxStates[index]}
                  onCheckboxChange={subMenuIndex =>
                    handleCheckboxChange(index, subMenuIndex)
                  }
                  selectedCount={selectedCount}
                  onToggleAllCheckboxes={() => handleToggleAllCheckboxes(index)}
                />
              );
            })}
          </FilterLayout>
        </FilterItemWrapper>
      )}
    </FilterMenuWrapper>
  );
};
