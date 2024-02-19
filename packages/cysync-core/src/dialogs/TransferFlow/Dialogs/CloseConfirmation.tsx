import {
  Flex,
  Button,
  LangDisplay,
  goldFail,
  IconDialogBox,
  Image,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        onClick={() => {
          setShowOnClose(false);
        }}
        variant="secondary"
      >
        <LangDisplay
          text={lang.strings.guidedFlows.closeDialog.buttons.secondary}
        />
      </Button>
      <Button
        onClick={() => {
          setShowOnClose(false);
          dispatch(closeDialog('guidedFlow'));
        }}
        variant="primary"
      >
        <LangDisplay
          text={lang.strings.guidedFlows.closeDialog.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

export const CloseConfirmation: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <IconDialogBox
      $isModal
      icon={<Image src={goldFail} alt="gold cross" />}
      title={lang.strings.guidedFlows.closeDialog.title}
      subtext={lang.strings.guidedFlows.closeDialog.subtitle}
      footerComponent={<Buttons setShowOnClose={setShowOnClose} />}
      onClose={() => setShowOnClose(false)}
    />
  );
};
