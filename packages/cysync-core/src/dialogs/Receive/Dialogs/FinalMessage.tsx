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
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={circledCheckIcon} alt="Check Icon" />
        <ScrollableContainer $maxHeight={{ def: '50vh', lg: '65vh' }}>
          <DialogBoxBody p={0}>
            {isAddressVerified ? (
              <Typography variant="h5" $textAlign="center">
                <LangDisplay text={lang.strings.receive.congrats.title} />
              </Typography>
            ) : (
              <>
                <AddressDisplay />
                <MessageBox
                  text={lang.strings.receive.receive.messageBox.warning}
                  type="warning"
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
