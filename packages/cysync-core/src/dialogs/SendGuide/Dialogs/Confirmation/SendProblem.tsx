import {
  LangDisplay,
  IconDialogBox,
  warningIcon,
  Button,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../../context';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const SendProblem: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();
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

  return (
    <IconDialogBox
      icon={<Image src={warningIcon} alt="sync error" />}
      title={problem.title}
      footerComponent={
        <Button variant="primary">
          <LangDisplay text={button.retry} />
        </Button>
      }
    />
  );
};
