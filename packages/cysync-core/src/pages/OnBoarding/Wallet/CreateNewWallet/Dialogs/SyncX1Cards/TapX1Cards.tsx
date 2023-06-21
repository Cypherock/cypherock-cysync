import {
  Container,
  Flex,
  Image,
  arrowGoldenForward,
  syncX1Cards,
  CreateWalletDialogBoxLayout,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const TapX1Cards: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <CreateWalletDialogBoxLayout
      state={state}
      heading={lang.strings.onboarding.createWallet.syncX1Cards.heading}
      title={lang.strings.onboarding.createWallet.syncX1Cards.title}
      setState={setState}
      image={syncX1Cards}
      subTitle={lang.strings.onboarding.createWallet.syncX1Cards.subTitle}
    >
      <Flex
        gap={8}
        px={5}
        pt={{
          def: 2,
          lg: 6,
        }}
        direction="column"
      >
        {lang.strings.onboarding.createWallet.syncX1Cards.list.map(
          (item, index) => (
            <Container
              key={`syncX1Cards-list-index-${index + 1}`}
              $alignSelf="start"
              align="center"
              gap={17}
              width="full"
              justify="flex-start"
              rounded={8}
              $bgColor="input"
              border="input"
              p="12"
            >
              <Image src={arrowGoldenForward} alt="arrowGoldenForward" />
              <Typography variant="h6" color="muted">
                <LangDisplay text={item} />
              </Typography>
            </Container>
          ),
        )}
      </Flex>
    </CreateWalletDialogBoxLayout>
  );
};
