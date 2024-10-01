import {
  DialogBox,
  GuidedFlowDialogBox,
  tapAnyCardDeviceAnimation2DVideo,
  Video,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../../context';

export const AuthenticateClearData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.instructions.dialogs;
  const { onNext, onPrevious } = useInheritanceEstateRecoveryDialog();
  return (
    <DialogBox width={800} direction="column">
      <GuidedFlowDialogBox
        image={
          <Video
            src={tapAnyCardDeviceAnimation2DVideo}
            $height={237}
            $width={420}
            autoPlay
            loop
          />
        }
        onNext={() => onNext()}
        onPrevious={() => onPrevious()}
        title={strings.tapCards.title}
        subtitle={strings.tapCards.subTitle}
        messageBoxList={strings.tapCards.messageBoxList}
      />
    </DialogBox>
  );
};
