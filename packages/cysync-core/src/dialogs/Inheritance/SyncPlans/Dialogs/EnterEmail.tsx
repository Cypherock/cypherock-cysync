import { Flex, Input, LangDisplay, Typography } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { useStateWithRef } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { validateEmail } from '~/utils';

import { useInheritanceSyncPlansDialog } from '../context';
import { InheritanceSyncPlansLayout } from '../Layout';

export const EnterEmail: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onClose,
    onEnterEmail,
    email: existingEmail,
    isSendingEmail,
  } = useInheritanceSyncPlansDialog();
  const strings = lang.strings.dialogs.inheritanceSyncPlans;

  const [email, setEmail] = useStateWithRef(existingEmail);
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );

  const validateInputEmail = (newEmail: string) => {
    if (newEmail.length === 0) {
      setValidationError(undefined);
      return;
    }

    const validation = validateEmail(newEmail, lang);

    if (!validation.success) {
      setValidationError(validation.error.issues[0].message);
      return;
    }

    setValidationError(undefined);
  };

  const onEmailChange = (val: string) => {
    setEmail(val);
    validateInputEmail(val);
  };

  const onSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validationError) {
      onEnterEmail(email);
    }
  };

  const formId = 'inheritance-sync-plans-enter-email';
  const displayError = validationError;

  return (
    <InheritanceSyncPlansLayout
      onClose={onClose}
      actionButtonText={strings.enterEmail.button}
      isActionButtonDisabled={
        !email || Boolean(validationError) || isSendingEmail
      }
      isActionButtonLoading={isSendingEmail}
      onActionButtonClick={onSubmit}
      formId={formId}
    >
      <form onSubmit={onSubmit} id={formId} style={{ width: '100%' }}>
        <Flex direction="column" align="center" justify="center" $width="100%">
          <Typography $fontSize={20} $textAlign="center" color="white" mb="4px">
            {strings.enterEmail.title}
          </Typography>
          <Typography $fontSize={16} $textAlign="center" color="muted" mb={4}>
            {strings.enterEmail.subTitle}
          </Typography>
          <Input
            pasteAllowed
            name="email"
            type="email"
            label={lang.strings.labels.email}
            rightLabel={lang.strings.labels.required}
            value={email}
            required
            onChange={onEmailChange}
            showRequiredStar
            disabled={isSendingEmail}
            autoFocus
          />
          {displayError && (
            <Typography
              pt={1}
              color="error"
              $fontSize={16}
              $textAlign="left"
              $width="100%"
            >
              <LangDisplay text={displayError} />
            </Typography>
          )}
        </Flex>
      </form>
    </InheritanceSyncPlansLayout>
  );
};
