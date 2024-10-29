import { parseLangTemplate, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditUserDetailsDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, userType } = useInheritanceEditUserDetailsDialog();
  const strings = lang.strings.dialogs.inheritanceEditUserDetails.success;

  return (
    <SuccessDialog
      title={parseLangTemplate(strings.title, { userType })}
      buttonText={lang.strings.buttons.done}
      onClose={onClose}
      width={560}
      handleClick={onClose}
      headerType="h5"
      bodyBottomPadding={4}
      showCloseBtn
    />
  );
};
