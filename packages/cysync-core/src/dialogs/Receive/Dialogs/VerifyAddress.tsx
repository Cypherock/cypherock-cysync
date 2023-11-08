import { ReceiveDeviceEvent } from '@cypherock/coin-support-interfaces';
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

export const VerifyAddress: React.FC = () => {
  const { onNext, onRetry, deviceEvents, isFlowCompleted } = useReceiveDialog();
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    if (isFlowCompleted) {
      onRetry();
    }
  }, []);

  useEffect(() => {
    if (!isFlowCompleted && deviceEvents[ReceiveDeviceEvent.VERIFIED]) {
      onNext();
    }
  }, [deviceEvents]);

  const dataArray = [
    {
      id: '0',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: lang.strings.receive.receive.actions.verify,
      rightImage: <Throbber size={15} strokeWidth={2} />,
    },
  ];

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        <GenericConfirmDeviceGraphics />
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            <AddressDisplay />
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
