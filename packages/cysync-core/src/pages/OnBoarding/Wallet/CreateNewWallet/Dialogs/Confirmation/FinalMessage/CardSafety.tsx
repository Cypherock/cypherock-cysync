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
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.finalMessage.cardSafety.heading
      }
      title={lang.strings.onboarding.createWallet.finalMessage.cardSafety.title}
      setState={setState}
      image={informationIcon}
    >
      <Flex px={5}>
        <Container
          $bgColor="input"
          border="info"
          align="center"
          rounded={8}
          p={2}
        >
          <Typography $textAlign="center" color="info">
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
