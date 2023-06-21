import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  Bullet,
  Container,
  Flex,
  Image,
  LangDisplay,
  Typography,
  goldInfo,
  setupPin,
  CreateWalletDialogBoxLayout,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

export const SetupWalletPin: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      state={state}
      setState={setState}
      heading={lang.strings.onboarding.createWallet.enterPin.heading}
      image={setupPin}
      title={lang.strings.onboarding.createWallet.enterPin.title}
    >
      <Flex
        direction="column"
        pt={{
          def: 2,
          lg: 6,
        }}
        gap={{ def: 18, lg: 48 }}
        px={7}
      >
        <Container
          $bgColor="input"
          direction="column"
          align="flex-start"
          gap={{ def: 8, lg: 16 }}
          rounded={8}
          px={3}
          py={2}
        >
          {lang.strings.onboarding.createWallet.enterPin.list.map(
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
        <Container $bgColor="input" align="center" rounded={8} gap={18} p={1}>
          <Image src={goldInfo} alt="info" />
          <Typography color="warn">
            <LangDisplay
              text={lang.strings.onboarding.createWallet.enterPin.note}
            />
          </Typography>
        </Container>
      </Flex>
    </CreateWalletDialogBoxLayout>
  );
};
