import {
  CreateWalletDialogBoxLayout,
  Flex,
  informationIcon,
  Button,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

const Buttons = () => (
  <Flex gap={16}>
    <Button variant="secondary">Skip</Button>
    <Button variant="primary">Add Account</Button>
  </Flex>
);

export const AddAccount: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.finalMessage.addAccount.heading
      }
      title={lang.strings.onboarding.createWallet.finalMessage.addAccount.title}
      setState={setState}
      image={informationIcon}
      footer={<Buttons />}
    />
  );
};
