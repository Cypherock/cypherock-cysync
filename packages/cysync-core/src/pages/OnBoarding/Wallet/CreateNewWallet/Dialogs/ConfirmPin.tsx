import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  Bullet,
  Container,
  Flex,
  LangDisplay,
  Typography,
  confirmPin,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmPin: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      setState={setState}
      heading={lang.strings.onboarding.createWallet.confirmPin.heading}
      image={confirmPin}
      isLoading
      loadingText={lang.strings.onboarding.createWallet.confirmPin.loading}
      title={lang.strings.onboarding.createWallet.confirmPin.title}
    >
      <Flex direction="column" gap={48} px={7}>
        <Container
          $bgColor="input"
          direction="column"
          align="flex-start"
          gap={16}
          rounded={8}
          px={3}
          py={2}
        >
          {lang.strings.onboarding.createWallet.confirmPin.list.map(
            (item, index) => (
              <Flex
                key={`create-wallet-list-${index + 1}`}
                gap={16}
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
