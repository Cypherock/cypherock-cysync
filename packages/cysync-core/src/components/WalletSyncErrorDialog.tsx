import { BlurOverlay, ErrorDialog } from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import { selectLanguage, useAppSelector } from '..';

export const WalletSyncErrorDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDropdownItems, setSelectedDropdownItems] = useState([
    {
      label: lang.strings.walletSync.freshOneCreated.dropdown.cypherockRed,
      checked: true,
    },
    {
      label: lang.strings.walletSync.freshOneCreated.dropdown.official,
      checked: true,
    },
    {
      label: lang.strings.walletSync.freshOneCreated.dropdown.personal,
      checked: true,
    },
  ]);

  return (
    <BlurOverlay>
      <ErrorDialog
        title={lang.strings.walletSync.freshOneCreated.title}
        subtext={lang.strings.walletSync.freshOneCreated.subTitle}
        iconType="walletSync"
        showDelete
        showKeepAll
        dropdownItems={selectedDropdownItems}
        setSelectedDropdownItems={setSelectedDropdownItems}
        checkBoxText={lang.strings.walletSync.freshOneCreated.checkboxText}
        isChecked={isChecked}
        checkBoxHandler={() => setIsChecked(prevProps => !prevProps)}
      />
    </BlurOverlay>
  );
};
