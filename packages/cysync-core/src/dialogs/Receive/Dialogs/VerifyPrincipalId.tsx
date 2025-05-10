import { IcpReceiveDeviceEvent } from '@cypherock/coin-support-icp';
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
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

export const VerifyPrincipalId: React.FC = () => {
  const {
    onRetry,
    deviceEvents,
    isFlowCompleted,
    derivedPrincipalId,
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
    if (
      !isFlowCompleted &&
      deviceEvents[IcpReceiveDeviceEvent.PRINCIPAL_ID_VERIFIED]
    ) {
      onAddressVerificationNext();
    }
  }, [deviceEvents]);

  const dataArray = [
    {
      id: '0',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: lang.strings.receive.receive.actions.verifyPrincipalId,
      rightImage: <Throbber size={15} strokeWidth={2} />,
    },
  ];

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        <GenericConfirmDeviceGraphics />
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            <AddressDisplay
              titlePrefix={texts.title.principalIdPrefix}
              titleSuffix={texts.title.suffix}
              addressLabel={texts.principalIdLabel}
              address={derivedPrincipalId ?? ''}
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
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
