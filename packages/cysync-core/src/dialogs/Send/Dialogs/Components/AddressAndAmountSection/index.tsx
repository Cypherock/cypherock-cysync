import { TabContentContainer, Tabs } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { SingleTransaction } from './SingleTransaction';

export const AddressAndAmountSection: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const bitcoin = lang.strings.send.bitcoin.info.dialogBox.transaction;
  const tabs = [
    {
      label: bitcoin.tabs.tab1,
      content: (
        <TabContentContainer>
          <SingleTransaction />
        </TabContentContainer>
      ),
    },
    {
      label: bitcoin.tabs.tab2,
      content: (
        <TabContentContainer>
          <div>test</div>
        </TabContentContainer>
      ),
    },
  ];
  return <Tabs tabs={tabs} />;
};
