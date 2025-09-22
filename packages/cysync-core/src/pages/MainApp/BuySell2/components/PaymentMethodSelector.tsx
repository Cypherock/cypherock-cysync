import { Dropdown, Typography, Flex } from '@cypherock/cysync-ui';
import React from 'react';

import { useBuySell2 } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

export const PaymentMethodSelector = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.buySell.buy.selectPaymentMethod;

  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethodsDropdownList,
  } = useBuySell2();

  const handleChange = (id?: string) => {
    if (!id) {
      setSelectedPaymentMethod('card');
      return;
    }
    setSelectedPaymentMethod(id);
  };

  return (
    <Flex direction="column" gap={8}>
      <Typography $fontSize={12} color="muted">
        {strings.title}
      </Typography>
      <Dropdown
        items={paymentMethodsDropdownList}
        selectedItem={selectedPaymentMethod}
        onChange={handleChange}
        placeholderText={strings.placeholder}
        searchText={strings.searchText}
        disabled={paymentMethodsDropdownList.length === 0}
      />
    </Flex>
  );
};
