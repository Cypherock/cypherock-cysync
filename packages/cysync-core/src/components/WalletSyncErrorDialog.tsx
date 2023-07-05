import {
  BlurOverlay,
  CheckboxListItems,
  CheckboxList,
  Flex,
  CheckBox,
  Button,
  walletErrorIcon,
  Image,
  IconDialogBox,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import { selectLanguage, useAppSelector } from '..';

export const WalletSyncErrorDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedCheckboxListItems, setSelectedCheckboxListItems] =
    useState<CheckboxListItems>([
      {
        label:
          lang.strings.walletSync.freshOneCreated.checkboxList.cypherockRed,
        checked: true,
      },
      {
        label: lang.strings.walletSync.freshOneCreated.checkboxList.official,
        checked: true,
      },
      {
        label: lang.strings.walletSync.freshOneCreated.checkboxList.personal,
        checked: true,
      },
    ]);

  return (
    <BlurOverlay>
      <IconDialogBox
        title={lang.strings.walletSync.freshOneCreated.title}
        subtext={lang.strings.walletSync.freshOneCreated.subTitle}
        icon={<Image src={walletErrorIcon} alt="walletSync" />}
        afterTextComponent={
          <>
            <CheckboxList
              items={selectedCheckboxListItems}
              setSelectedItems={setSelectedCheckboxListItems}
            />
            <Flex align="center" justify="center" width="full">
              <CheckBox
                checked={isChecked}
                onChange={() => setIsChecked(prevProps => !prevProps)}
                id="wallet_checkbox"
                label={lang.strings.walletSync.freshOneCreated.checkboxText}
              />
            </Flex>
          </>
        }
        footerComponent={
          <>
            <Button variant="secondary">Keep it all</Button>
            <Button variant="primary">Delete</Button>
          </>
        }
      />
    </BlurOverlay>
  );
};
