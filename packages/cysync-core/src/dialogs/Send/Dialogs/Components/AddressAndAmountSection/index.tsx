import { TabContentContainer, Tabs } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { BatchTransactionBody } from './BatchTransactionBody';
import { SingleTransaction } from './SingleTransaction';

export const AddressAndAmountSection: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  const tabs = [
    {
      label: displayText.tabs.single,
      content: (
        <TabContentContainer>
          <SingleTransaction />
        </TabContentContainer>
      ),
    },
    {
      label: displayText.tabs.batch,
      content: (
        <TabContentContainer>
          <BatchTransactionBody />
        </TabContentContainer>
      ),
    },
  ];
  return <Tabs tabs={tabs} />;
};
