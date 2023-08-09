import {
  DialogBox,
  DialogBoxBody,
  Image,
  arrowGoldenForward,
  confirmIcon,
  LeanBoxContainer,
  LeanBox,
  Throbber,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

export const VerifyAddress: React.FC = () => {
  const { onNext, deviceEvents } = useReceiveDialog();
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    // TODO: uncomment when sdk is forwarding device events
    // if (deviceEvents[ReceiveDeviceEvent.VERIFIED]) {
    //   onNext();
    // }
  }, [deviceEvents]);

  // TODO: remove this when sdk is forwarding device events
  addKeyboardEvents({
    Enter: onNext,
  });

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
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={confirmIcon} alt="Verify Coin" />
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
    </DialogBox>
  );
};
