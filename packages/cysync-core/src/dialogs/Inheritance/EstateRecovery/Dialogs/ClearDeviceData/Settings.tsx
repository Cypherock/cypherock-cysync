import {
  confirmDeviceSettings,
  DialogBox,
  GuidedFlowDialogBox,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../../context';

export const Settings = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.instructions.dialogs;
  const { onNext, onPrevious } = useInheritanceEstateRecoveryDialog();
  return (
    <DialogBox width={800} direction="column">
      <GuidedFlowDialogBox
        image={
          <Image src={confirmDeviceSettings} alt="confirm device settings" />
        }
        onNext={() => onNext()}
        onPrevious={() => onPrevious()}
        title={strings.settings.title}
      />
    </DialogBox>
  );
};
