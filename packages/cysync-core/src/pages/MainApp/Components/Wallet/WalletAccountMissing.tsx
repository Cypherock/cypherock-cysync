import {
  NoAccountWrapper,
  ReceievedBorderGreen,
  SkeletonLoader,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

const skeletonData = {
  loader: <ReceievedBorderGreen />,
  text: 'Accounts Missing',
  subText: 'Create or import an account to get started',
};

export const WalletAccountMissing: FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <NoAccountWrapper $hasCustomStyles>
      <SkeletonLoader
        loader={skeletonData.loader}
        text={skeletonData.text}
        subText={skeletonData.subText}
        $buttonOne={
          lang.strings.wallet.cypherock.accountMissing.buttons.addAccount
        }
      />
    </NoAccountWrapper>
  );
};
