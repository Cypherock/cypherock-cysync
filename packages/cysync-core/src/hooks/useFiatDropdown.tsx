import { fiatCurrencyList, IFiatCurrency } from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

export interface UseFiatDropdownProps {
  defaultFiatCurrency?: string;
}

export const useFiatDropdown = ({
  defaultFiatCurrency,
}: UseFiatDropdownProps = {}) => {
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState<
    IFiatCurrency | undefined
  >();

  const fiatDropdownList: DropDownItemProps[] = useMemo(
    () =>
      Object.values(fiatCurrencyList).map(currency => ({
        id: currency.code,
        checkType: 'radio',
        text: currency.name,
        shortForm: `(${currency.code.toUpperCase()})`,
      })),
    [fiatCurrencyList],
  );

  const handleFiatCurrencyChange = (currencyCode?: string) => {
    if (!currencyCode) {
      setSelectedFiatCurrency(undefined);
      return;
    }

    const currency = fiatCurrencyList[currencyCode];
    setSelectedFiatCurrency(currency);
  };

  // Set default selection if provided
  React.useEffect(() => {
    if (defaultFiatCurrency && !selectedFiatCurrency) {
      const currency = fiatCurrencyList[defaultFiatCurrency];
      setSelectedFiatCurrency(currency);
    }
  }, [defaultFiatCurrency, selectedFiatCurrency]);

  return {
    selectedFiatCurrency,
    setSelectedFiatCurrency,
    handleFiatCurrencyChange,
    fiatDropdownList,
  };
};
