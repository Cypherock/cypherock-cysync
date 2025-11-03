import {
  FailIcon,
  Image,
  SuccessDialog as SuccessDialogComponent,
  successIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { constants } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

export const SuccessDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.success;
  const { isUserEligibleForCanton, isUserInWaitingListForCanton, onNext } =
    useAddAccountDialog();

  let title = '';
  let subtext = '';
  let buttonText = '';
  let dialogIcon = <Image src={successIcon} alt="Success icon" />;
  let buttonClickHandler = onNext;

  const knowMoreAboutCanton = () => {
    window.open(constants.inheritance.cantonLink, '_blank');
  };

  if (isUserEligibleForCanton && !isUserInWaitingListForCanton) {
    title = strings.eligibleAndCanProceed.title;
    buttonText = lang.strings.buttons.next;
    buttonClickHandler = onNext;
  } else if (isUserEligibleForCanton && isUserInWaitingListForCanton) {
    title = strings.eligibleAndAddedInWaitlist.title;
    subtext = strings.eligibleAndAddedInWaitlist.subtext;
    buttonText = strings.buttonText;
    buttonClickHandler = knowMoreAboutCanton;
  } else {
    dialogIcon = <FailIcon />;
    title = strings.notEligible.title;
    subtext = strings.notEligible.subtext;
    buttonText = strings.buttonText;
    buttonClickHandler = knowMoreAboutCanton;
  }

  return (
    <SuccessDialogComponent
      icon={dialogIcon}
      title={title}
      subtext={subtext}
      buttonText={buttonText}
      handleClick={buttonClickHandler}
      width={800}
    />
  );
};
