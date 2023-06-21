import {
  Container,
  Flex,
  CreateWalletDialogBoxLayout,
  informationIcon,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const CardSafety: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.finalMessage.cardSafety.heading
      }
      title={lang.strings.onboarding.createWallet.finalMessage.cardSafety.title}
      state={state}
      setState={setState}
      image={informationIcon}
    >
      <Flex
        px={5}
        pt={{
          def: 2,
          lg: 6,
        }}
      >
        <Container
          $bgColor="input"
          border="info"
          align="center"
          rounded={8}
          p={2}
        >
          <Typography $textAlign="center" color="warn">
            <LangDisplay
              text={
                lang.strings.onboarding.createWallet.finalMessage.cardSafety
                  .note
              }
            />
          </Typography>
        </Container>
      </Flex>
    </CreateWalletDialogBoxLayout>
  );
};
