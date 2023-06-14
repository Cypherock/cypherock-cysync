import React, { FC, useState } from 'react';
import {
  DialogBox,
  DialogBoxBody,
  LogoOutlinedAsideImage,
  HelpHeader,
  Container,
  Flex,
  WalletDialogAside,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from '../../OnboardingPageLayout';
import { DeviceTab } from './DeviceTab';

export const CreateNewWallet: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = useState<number>(0);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      showBlurBackground
      totalState={8}
      withHelp
      withBack
    >
      <DialogBox direction="row" gap={0} width="full">
        <WalletDialogAside
          tabs={lang.strings.onboarding.createWallet.aside.tabs}
          state={state}
        />
        <Flex
          width="full"
          height="full"
          direction="column"
          $bgColor="contentGradient"
        >
          <Container width="full" p={2} justify="flex-start">
            <HelpHeader text={lang.strings.help} />
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
                {state <= 5 && <DeviceTab state={state} setState={setState} />}
              </DialogBoxBody>
            </DialogBox>
          </DialogBoxBody>
        </Flex>
      </DialogBox>
    </OnboardingPageLayout>
  );
};
