import {
  Bullet,
  Container,
  CreateWalletDialogBoxLayout,
  Flex,
  LangDisplay,
  Typography,
  informationIcon,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const AddAnotherWallet: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.finalMessage.addAnotherWallet
          .heading
      }
      title={
        lang.strings.onboarding.createWallet.finalMessage.addAnotherWallet.title
      }
      setState={setState}
      image={informationIcon}
    >
      <Flex px={7}>
        <Container
          $bgColor="input"
          direction="column"
          align="flex-start"
          gap={{ def: 8, lg: 16 }}
          rounded={8}
          px={3}
          py={2}
        >
          {lang.strings.onboarding.createWallet.finalMessage.addAnotherWallet.list.map(
            (item, index) => (
              <Flex
                key={`create-wallet-list-${index + 1}`}
                gap={{ def: 8, lg: 16 }}
                align="center"
              >
                <Bullet size="sm" />
                <Typography color="muted">
                  <LangDisplay text={item} />
                </Typography>
              </Flex>
            ),
          )}
        </Container>
      </Flex>
    </CreateWalletDialogBoxLayout>
  );
};
