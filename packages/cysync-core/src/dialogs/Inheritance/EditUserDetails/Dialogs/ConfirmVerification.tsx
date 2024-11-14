import {
  Button,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxFooter,
  DialogBoxHeader,
  LangDisplay,
  MessageBox,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';
import { LoaderDialog } from '~/components';

import { useAppSelector } from '~/store';
import { selectLanguage } from '~/store/lang';

import { useInheritanceEditUserDetailsDialog } from '../context';

export const ConfirmVerification = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor;
  const { onClose, isLoading } = useInheritanceEditUserDetailsDialog();

  if (isLoading) return <LoaderDialog />;
  return (
    <DialogBox width={800} onClose={onClose} $maxHeight="90vh">
      <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <Container direction="column" gap={4}>
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
        >
          <LangDisplay text={strings.nomineeDetails.confirm.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.nomineeDetails.confirm.subtext} />
        </Typography>
      </Container>
      <Container>
        <MessageBox
          text={strings.nomineeDetails.confirm.warning}
          type="warning"
        />
      </Container>

      <DialogBoxFooter py={4} px={5}>
        <Button variant="secondary">
          <LangDisplay text={lang.strings.buttons.no} />
        </Button>
        <Button variant="primary">
          <LangDisplay text={lang.strings.buttons.yes} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
