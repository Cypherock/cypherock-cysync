import React from 'react';
import { Images } from '@/constants';
import { Banner } from '../ui';
import { selectLanguage, useAppSelector } from '@/store';
import * as Linking from 'expo-linking';

export const PortfolioHeader = () => {
  const { strings } = useAppSelector(selectLanguage);

  return (
    <Banner
      img={Images.other.banner_default}
      onPress={() =>
        Linking.openURL('https://www.cypherock.com/cypherock-cover')
      }
      title={strings.banner.title}
      subtitle={strings.banner.description}
      style={{ marginHorizontal: 16, marginVertical: 12 }}
    />
  );
};
