import { Flex, Button, LangDisplay, IconDialogBox } from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';

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
  const displayText =
    lang.strings.guidedFlows.walletTransferLostCards.closeDialog;
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        onClick={() => {
          setShowOnClose(false);
        }}
        variant="secondary"
      >
        <LangDisplay text={displayText.buttons.secondary} />
      </Button>
      <Button
        onClick={() => {
          setShowOnClose(false);
          dispatch(closeDialog('walletTransferLostCardsFlow'));
        }}
        variant="primary"
      >
        <LangDisplay text={displayText.buttons.primary} />
      </Button>
    </Flex>
  );
};

export const CloseConfirmation: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const displayText =
    lang.strings.guidedFlows.walletTransferLostCards.closeDialog;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowOnClose(false);
        dispatch(closeDialog('walletTransferLostCardsFlow'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowOnClose, dispatch]);
  return (
    <IconDialogBox
      $isModal
      title={displayText.title}
      subtext={displayText.subtitle}
      footerComponent={<Buttons setShowOnClose={setShowOnClose} />}
      transferFlow
      messageBoxList={displayText.messageBoxList}
      pathText={displayText.pathText}
    />
  );
};
