import { ReceiveDeviceEvent } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import {
  DialogBox,
  DialogBoxBody,
  Image,
  arrowGoldenForward,
  GenericConfirmDeviceGraphics,
  LeanBoxContainer,
  LeanBox,
  Throbber,
  ScrollableContainer,
  MessageBox,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

export const VerifyAddress: React.FC = () => {
  const {
    onRetry,
    deviceEvents,
    isFlowCompleted,
    selectedAccount,
    derivedAddress,
    onAddressVerificationNext,
  } = useReceiveDialog();
  const lang = useAppSelector(selectLanguage);
  const texts = lang.strings.receive.receive;

  useEffect(() => {
    if (isFlowCompleted) {
      onRetry();
    }
  }, []);

  useEffect(() => {
    if (!isFlowCompleted && deviceEvents[ReceiveDeviceEvent.VERIFIED]) {
      onAddressVerificationNext();
    }
  }, [deviceEvents]);

  const dataArray = [
    {
      id: '0',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: texts.actions.verify,
      rightImage: <Throbber size={15} strokeWidth={2} />,
    },
  ];

  let waitMessage: string | undefined;
  if (
    selectedAccount &&
    selectedAccount.familyId === coinFamiliesMap.starknet
  ) {
    waitMessage = texts.waitMessageBox.warning;
  }

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        <GenericConfirmDeviceGraphics />
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            <AddressDisplay
              titlePrefix={texts.title.prefix}
              titleSuffix={texts.title.suffix}
              addressLabel={texts.addressLabel}
              address={derivedAddress ?? ''}
            />
            <LeanBoxContainer>
              {dataArray.map(data => (
                <LeanBox
                  key={data.id}
                  leftImage={data.leftImage}
                  rightImage={data.rightImage}
                  text={data.text}
                  id={data.id}
                  px={6}
                />
              ))}
            </LeanBoxContainer>
            {waitMessage && <MessageBox type="warning" text={waitMessage} />}
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
