import {
  Button,
  CheckBox,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Divider,
  Dropdown,
  Flex,
  Input,
  InputLabel,
  LangDisplay,
  ScrollableContainer,
  TextAreaInput,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useContactSupportDialog } from '../context';

export const ContactForm: React.FC = () => {
  const {
    onClose,
    error,
    handleContactSupportSubmit,
    isLoading,
    isSubmitDisabled,
    email,
    setEmail,
    isEmailError,
    categories,
    selectedCategory,
    handleCategorySelection,
    description,
    setDescription,
    canAttatchAppLogs,
    setCanAttatchAppLogs,
    canAttatchDeviceLogs,
    setCanAttatchDeviceLogs,
  } = useContactSupportDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { form } = dialogs.contactSupport;

  return (
    <DialogBox width={500} $maxHeight="90vh" align="stretch" gap={0}>
      <DialogBoxHeader direction="row" py={2} px={3}>
        <Typography
          pl={3}
          grow={1}
          $alignSelf="stretch"
          color="muted"
          $textAlign="center"
        >
          <LangDisplay text={form.header} />
        </Typography>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody gap={0} p={0} align="stretch">
          <Flex px={5} py={4} gap={4} direction="column" align="center">
            <Typography $fontSize={20} color="white">
              <LangDisplay text={form.title} />
            </Typography>
            <Typography $fontSize={16} color="muted">
              <LangDisplay text={form.description} />
            </Typography>
          </Flex>
          <Flex
            gap={24}
            px={5}
            pt={2}
            pb={4}
            direction="column"
            align="stretch"
          >
            <form
              onSubmit={e => {
                e.preventDefault();
                handleContactSupportSubmit();
              }}
              id="contact-support-form"
            >
              <Flex gap={16} direction="column" align="stretch">
                <Input
                  pasteAllowed
                  name="email"
                  type="email"
                  placeholder={form.field.email.placeholder}
                  label={form.field.email.label}
                  value={email ?? ''}
                  onChange={setEmail}
                  $error={isEmailError}
                />
                <Flex direction="column" align="stretch" gap={0}>
                  <InputLabel>
                    <LangDisplay text={form.field.category.label} />
                  </InputLabel>
                  <Dropdown
                    items={categories}
                    selectedItem={selectedCategory}
                    searchText={form.field.category.placeholder}
                    placeholderText={form.field.category.placeholder}
                    onChange={handleCategorySelection}
                    disabled={isLoading}
                  />
                </Flex>
                <Flex direction="column" align="stretch" gap={0}>
                  <InputLabel>
                    <LangDisplay text={form.field.description.label} />
                  </InputLabel>
                  <TextAreaInput
                    placeholder={form.field.description.placeholder}
                    value={description ?? ''}
                    onChange={val => setDescription(val)}
                    disabled={isLoading}
                  />
                </Flex>
                <CheckBox
                  label={form.checks.attachAppLogs}
                  checked={canAttatchAppLogs}
                  isDisabled={isLoading}
                  onChange={() => setCanAttatchAppLogs(!canAttatchAppLogs)}
                />
                <CheckBox
                  label={form.checks.attachDeviceLogs}
                  checked={canAttatchDeviceLogs}
                  isDisabled={isLoading}
                  onChange={() =>
                    setCanAttatchDeviceLogs(!canAttatchDeviceLogs)
                  }
                />
                <Divider variant="horizontal" />
              </Flex>
            </form>
            {error && (
              <Typography $fontSize={16} pb={4} color="error">
                {error}
              </Typography>
            )}
          </Flex>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.cancel} />
        </Button>
        <Button
          form="contact-support-form"
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
          isLoading={isLoading}
        >
          <LangDisplay text={buttons.submit} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
