import {
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  LangDisplay,
  parseLangTemplate,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { useAppSelector } from '~/store';
import { selectLanguage } from '~/store/lang';
import { UserDetailsForm } from '../../components';

import { useInheritanceEditUserDetailsDialog } from '../context';

export const EditDetails = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, onUserDetailsSubmit, userType } =
    useInheritanceEditUserDetailsDialog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const strings = lang.strings.dialogs.inheritanceEditUserDetails.editDetails;
  const { form } = lang.strings.inheritance.dialog.userDetails;

  const formId = 'inheritance-edit-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onUserDetailsSubmit({
      name,
      email,
      alternateEmail,
    });
  };

  const isSameEmail = Boolean(email && email === alternateEmail);

  const [hasErrors, setHasErrors] = useState(false);
  const isFormIncomplete = useMemo(
    () => !name || !email || hasErrors,
    [hasErrors],
  );

  return (
    <DialogBox width={800} onClose={onClose} $maxHeight="90vh">
      <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody px={5} py={4} gap={0}>
          <UserDetailsForm
            onSubmit={onSubmit}
            formId={formId}
            strings={{
              title: parseLangTemplate(strings.title, { userType }),
              form: {
                ...form,
                emailField: {
                  tooltip: (strings as any)?.tooltip ?? '',
                  label: form.emailField.label,
                },
              },
            }}
            name={name}
            setName={setName}
            isSubmittingUserDetails={false}
            email={email}
            setEmail={setEmail}
            alternateEmail={alternateEmail}
            setAlternateEmail={setAlternateEmail}
            isAlternateEmailRequired={false}
            isSameEmail={isSameEmail}
            setHasErrors={setHasErrors}
          />
        </DialogBoxBody>
      </ScrollableContainer>

      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="primary"
          type="submit"
          form={formId}
          disabled={isSameEmail || isFormIncomplete}
        >
          <LangDisplay text={strings.buttons.verifyEmail} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
