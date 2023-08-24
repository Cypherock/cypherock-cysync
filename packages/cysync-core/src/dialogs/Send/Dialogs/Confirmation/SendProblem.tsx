import {
  LangDisplay,
  IconDialogBox,
  warningIcon,
  Button,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../context';

export const SendProblem: React.FC = () => {
  const { onNext, onPrevious, goTo } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const problem = lang.strings.send.transactionProblem.info.dialogBox;

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const handleRetry = () => {
    goTo(4, 0);
  };

  return (
    <IconDialogBox
      icon={<Image src={warningIcon} alt="sync error" />}
      title={problem.title}
      footerComponent={
        <Button variant="primary" onClick={handleRetry}>
          <LangDisplay text={button.retry} />
        </Button>
      }
    />
  );
};
