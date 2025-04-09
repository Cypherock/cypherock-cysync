import { constants } from '@cypherock/cysync-core-constants';
import {
  Button,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Input,
  LangDisplay,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { useAppSelector } from '~/store';
import { selectLanguage } from '~/store/lang';

import { useInheritanceEditUserDetailsDialog } from '../context';

export const EditDetails = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, onUserDetailsSubmit, isSubmittingUserDetails, userType } =
    useInheritanceEditUserDetailsDialog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');

  const strings = lang.strings.dialogs.inheritanceEditUserDetails.editDetails;
  const { form } = lang.strings.inheritance.dialog.userDetails;

  const formId = 'inheritance-edit-user-details';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmittingUserDetails) return;

    onUserDetailsSubmit({
      name,
      email,
      alternateEmail,
    });
  };

  return (
    <DialogBox width={800} onClose={onClose} $maxHeight="90vh">
      <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody px={5} py={4} gap={0}>
          <form style={{ width: '100%' }} onSubmit={onSubmit} id={formId}>
            <Container direction="column" $width="full" mb={4}>
              <Typography
                variant="h5"
                color="heading"
                $textAlign="center"
                $fontSize={20}
                mb="4px"
              >
                <LangDisplay text={strings.title} variables={{ userType }} />
              </Typography>
            </Container>
            <Container direction="column" $width="full" mb={3}>
              <Input
                pasteAllowed
                name="name"
                type="text"
                label={form.name}
                rightLabel={lang.strings.labels.required}
                value={name}
                required
                onChange={setName}
                showRequiredStar
                inputLabelProps={{
                  $fontSize: 12,
                  $letterSpacing: 'unset',
                }}
                disabled={isSubmittingUserDetails}
                maxLength={constants.inheritance.maxUserDetailsInputLength}
                autoFocus
              />
            </Container>
            <Container direction="row" $width="full" gap={24}>
              <Input
                pasteAllowed
                name="email"
                type="email"
                label={form.emailField.label}
                rightLabel={lang.strings.labels.required}
                value={email}
                required
                onChange={setEmail}
                showRequiredStar
                inputLabelProps={{
                  $fontSize: 12,
                  $letterSpacing: 'unset',
                }}
                disabled={isSubmittingUserDetails}
                maxLength={constants.inheritance.maxUserDetailsInputLength}
              />
              <Input
                pasteAllowed
                name="alternateEmail"
                type="email"
                label={form.alternateEmail}
                rightLabel={lang.strings.labels.required}
                value={alternateEmail}
                required
                onChange={setAlternateEmail}
                showRequiredStar
                inputLabelProps={{
                  $fontSize: 12,
                  $letterSpacing: 'unset',
                }}
                disabled={isSubmittingUserDetails}
                maxLength={constants.inheritance.maxUserDetailsInputLength}
              />
            </Container>
          </form>
        </DialogBoxBody>
      </ScrollableContainer>

      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="primary"
          type="submit"
          form={formId}
          disabled={isSubmittingUserDetails}
          isLoading={isSubmittingUserDetails}
        >
          <LangDisplay text={strings.buttons.verifyEmail} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
