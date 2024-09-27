import {
  clearDeviceData,
  DialogBox,
  GuidedFlowDialogBox,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../../context';

export const ClearData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.instructions.dialogs;
  const { onNext, onPrevious } = useInheritanceEstateRecoveryDialog();
  return (
    <DialogBox width={800} direction="column">
      <GuidedFlowDialogBox
        image={<Image src={clearDeviceData} alt="clear device data" />}
        onNext={() => onNext()}
        onPrevious={() => onPrevious()}
        title={strings.clearData.title}
      />
    </DialogBox>
  );
};
