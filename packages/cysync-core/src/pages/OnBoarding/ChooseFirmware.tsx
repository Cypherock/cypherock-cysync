import {
  Bitcoin,
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  LangDisplay,
  MessageBox,
  Multichain,
  Typography,
  cysyncLogoBig,
} from '@cypherock/cysync-ui';
import { FirmwareVariant } from '@cypherock/sdk-app-manager';
import { firmwareVariantToJSON } from '@cypherock/sdk-app-manager/dist/proto/generated/common';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { OnboardingPageLayout } from './OnboardingPageLayout';

interface ChooseFirmwareCardProps {
  isBtcOnly: boolean;
  title: string;
  subtext: string;
}

const ChooseFirmwareCard: React.FC<ChooseFirmwareCardProps> = ({
  isBtcOnly,
  title,
  subtext,
}) => {
  const lang = useAppSelector(selectLanguage);
  const { buttons } = lang.strings;

  const navigateTo = useNavigateTo();

  const handleContinue = async (isBtcOnlyParam: boolean) => {
    const targetVariant = firmwareVariantToJSON(
      isBtcOnlyParam ? FirmwareVariant.BTC_ONLY : FirmwareVariant.MULTI_COIN,
    );
    navigateTo(
      `${routes.onboarding.deviceUpdate.path}?disableNavigation=true&variant=${targetVariant}`,
    );
  };

  return (
    <DialogBox p={0} width={500}>
      <DialogBoxBody p={0} gap={0}>
        <Flex py={4} px={5} gap={32} direction="column" align="center">
          {isBtcOnly ? <Bitcoin /> : <Multichain />}
          <Typography
            variant="h5"
            $fontSize={20}
            $alignSelf="stretch"
            $textAlign="center"
          >
            <LangDisplay text={title} />
          </Typography>
        </Flex>
        <Flex pt={2} pb={4} px={5} direction="column" gap={6}>
          <MessageBox text={subtext} type="info" />
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter py={4} px={5}>
        <Button variant="primary" onClick={() => handleContinue(isBtcOnly)}>
          <LangDisplay text={buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

export const ChooseFirmware: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { heading, btcOnly, multiCoin } =
    lang.strings.onboarding.chooseFirmware;

  return (
    <OnboardingPageLayout
      img={cysyncLogoBig}
      text={heading}
      withHelp
      currentState={2}
      totalState={8}
    >
      <WithConnectedDevice onInitial showAnimation={false}>
        <Flex gap={16}>
          <ChooseFirmwareCard
            title={btcOnly.title}
            subtext={btcOnly.subtext}
            isBtcOnly
          />
          <ChooseFirmwareCard
            title={multiCoin.title}
            subtext={multiCoin.subtext}
            isBtcOnly={false}
          />
        </Flex>
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
