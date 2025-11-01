import {
  FailIcon,
  Image,
  SuccessDialog as SuccessDialogComponent,
  successIcon,
} from '@cypherock/cysync-ui';
import React from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useAddAccountDialog } from '../../context';

export const SuccessDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.success;
  const { onNext } = useAddAccountDialog();
  const isEligible = true;
  const inWaitingList = false;

  let title = '';
  let subtext = '';
  let buttonText = '';
  let dialogIcon = <Image src={successIcon} alt="Success icon" />;

  if (isEligible && !inWaitingList) {
    title = strings.eligibleAndCanProceed.title;
    buttonText = lang.strings.buttons.next;
  } else if (isEligible && inWaitingList) {
    title = strings.eligibleAndAddedInWaitlist.title;
    subtext = strings.eligibleAndAddedInWaitlist.subtext;
    buttonText = strings.buttonText;
  } else {
    dialogIcon = <FailIcon />;
    title = strings.notEligible.title;
    subtext = strings.notEligible.subtext;
    buttonText = strings.buttonText;
  }

  return (
    <SuccessDialogComponent
      icon={dialogIcon}
      title={title}
      subtext={subtext}
      buttonText={buttonText}
      handleClick={onNext}
      width={800}
    />
  );
};
