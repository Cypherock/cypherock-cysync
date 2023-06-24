import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  Container,
  Flex,
  enterWalletName,
  Bullet,
  Typography,
  LangDisplay,
  InfoIcon,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

export const EnterWalletName: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      state={state}
      setState={setState}
      heading={lang.strings.onboarding.createWallet.enterWalletName.heading}
      image={enterWalletName}
      title={lang.strings.onboarding.createWallet.enterWalletName.title}
    >
      <Flex
        direction="column"
        pt={{
          def: 2,
          lg: 6,
        }}
        gap={{ def: 24, lg: 48 }}
        px={7}
      >
        <Container
          $bgColor="input"
          direction="column"
          align="flex-start"
          gap={16}
          rounded={8}
          px={3}
          py={2}
        >
          {lang.strings.onboarding.createWallet.enterWalletName.list.map(
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
        <Container $bgColor="input" align="center" rounded={8} gap={18} p={1}>
          <InfoIcon width={36} height={36} />
          <Typography>
            <LangDisplay
              text={lang.strings.onboarding.createWallet.enterWalletName.note}
            />
          </Typography>
        </Container>
      </Flex>
    </CreateWalletDialogBoxLayout>
  );
};
