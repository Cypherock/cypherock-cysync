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
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { DialogBoxLayout } from '../DialogBoxLayout';

export const SetupWalletPin: FC<{
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <DialogBoxLayout
      setState={setState}
      heading={lang.strings.onboarding.createWallet.enterPin.heading}
      image={setupPin}
      title={lang.strings.onboarding.createWallet.enterPin.title}
    >
      <Flex direction="column" gap={{ def: 18, lg: 48 }} px={7}>
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
          <Typography color="info">
            <LangDisplay
              text={lang.strings.onboarding.createWallet.enterPin.note}
            />
          </Typography>
        </Container>
      </Flex>
    </DialogBoxLayout>
  );
};
