import { Flex, Button, LangDisplay, IconDialogBox } from '@cypherock/cysync-ui';
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
          text={
            lang.strings.guidedFlows.walletTransferLessCards.closeDialog.buttons
              .secondary
          }
        />
      </Button>
      <Button
        onClick={() => {
          setShowOnClose(false);
          dispatch(closeDialog('transferLessCardsFlow'));
        }}
        variant="primary"
      >
        <LangDisplay
          text={
            lang.strings.guidedFlows.walletTransferLessCards.closeDialog.buttons
              .primary
          }
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
      title={lang.strings.guidedFlows.walletTransferLessCards.closeDialog.title}
      subtext={
        lang.strings.guidedFlows.walletTransferLessCards.closeDialog.subtitle
      }
      footerComponent={<Buttons setShowOnClose={setShowOnClose} />}
      transferFlow
      messageBoxList={
        lang.strings.guidedFlows.walletTransferLessCards.closeDialog
          .messageBoxList
      }
      pathText={
        lang.strings.guidedFlows.walletTransferLessCards.closeDialog.pathText
      }
    />
  );
};
