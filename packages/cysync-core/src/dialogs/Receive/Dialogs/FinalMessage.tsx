import {
  DialogBox,
  DialogBoxBody,
  Image,
  DialogBoxFooter,
  Button,
  circledCheckIcon,
  MessageBox,
  Typography,
  LangDisplay,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressDisplay } from './Components';

import { useReceiveDialog } from '../context';

export const FinalMessage: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const buttons = lang.strings.receive.finalButtons;
  const { onRetry, onClose, isAddressVerified } = useReceiveDialog();

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        {isAddressVerified && <Image src={circledCheckIcon} alt="Check Icon" />}
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            {isAddressVerified ? (
              <Typography variant="h5" $textAlign="center">
                <LangDisplay text={lang.strings.receive.congrats.title} />
              </Typography>
            ) : (
              <>
                <AddressDisplay />
                <MessageBox
                  text={lang.strings.receive.receive.messageBox.warning}
                  type="danger"
                />
              </>
            )}
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={onRetry}>
          {isAddressVerified ? buttons.secondary : buttons.secondaryUnverified}
        </Button>
        <Button variant="primary" onClick={onClose}>
          {buttons.primary}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
