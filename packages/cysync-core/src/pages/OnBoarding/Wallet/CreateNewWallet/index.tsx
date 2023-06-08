import React, { FC, useState } from 'react';
import {
  DialogBox,
  DialogBoxBody,
  LogoOutlinedAsideImage,
  HelpHeader,
  Container,
  Flex,
  Button,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from '../../OnboardingPageLayout';
import { Aside } from './Aside';
import { Instructions } from './Dialogs/Instructions';
import { EnterWalletName } from './Dialogs/EnterWalletName';
import { ConfirmWalletName } from './Dialogs/ConfirmWalletName';
import { WalletPinConsent } from './Dialogs/WalletPinConsent';
import { SetupWalletPin } from './Dialogs/SetupWalletPin';
import { ConfirmPin } from './Dialogs/ConfirmPin';

export const CreateNewWallet: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = useState<number>(0);
  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      isDialogOpen
      totalState={8}
      withHelp
      withBack
    >
      <DialogBox direction="row" gap={0} width="full">
        <Aside />
        <Flex
          width="full"
          height="full"
          direction="column"
          $bgColor="contentGradient"
        >
          <Container width="full" p={2} justify="flex-start">
            <Button variant="none">
              <HelpHeader text={lang.strings.help} />
            </Button>
          </Container>
          <DialogBoxBody
            p="20"
            grow={2}
            align="center"
            gap={110}
            direction="column"
            height="full"
          >
            <DialogBox width={500}>
              <DialogBoxBody p="0">
                {state === 0 && <Instructions setState={setState} />}
                {state === 1 && <EnterWalletName setState={setState} />}
                {state === 2 && <ConfirmWalletName setState={setState} />}
                {state === 3 && <WalletPinConsent setState={setState} />}
                {state === 4 && <SetupWalletPin setState={setState} />}
                {state === 5 && <ConfirmPin setState={setState} />}
              </DialogBoxBody>
            </DialogBox>
          </DialogBoxBody>
        </Flex>
      </DialogBox>
    </OnboardingPageLayout>
  );
};
