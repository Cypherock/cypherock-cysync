import {
  Accordion,
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Flex,
  InputLabel,
  LangDisplay,
  MessageBox,
  Reminder,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditReminderTimeDialog } from '../context';

export const ReminderSetup = () => {
  const lang = useAppSelector(selectLanguage);
  const [loading, setLoading] = useState(false);
  const { onClose, updateData, reminder } =
    useInheritanceEditReminderTimeDialog();
  const [newReminder, setNewReminder] = useState(reminder ?? 1);
  const strings =
    lang.strings.dialogs.inheritanceEditReminderTime.reminderSetup;
  const { form } = strings;

  if (loading) {
    return (
      <LoaderDialog
        title={strings.loading.title}
        subtext={strings.loading.subtitle}
      />
    );
  }

  return (
    <DialogBox width={800} onClose={onClose} $maxHeight="90vh">
      <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody px={5} py={4} gap={32}>
          <Flex gap={0} direction="column" align="center">
            <Typography variant="h5" color="white">
              <LangDisplay text={strings.title} />
            </Typography>
          </Flex>
          <Flex gap={24} direction="column" my={2} align="stretch">
            <Accordion
              id="ReminderInfo"
              title={strings.reminderInfo.subtitle}
              content={strings.reminderInfo.subtext}
            />
            <Flex direction="column" align="stretch" $flex="1" width="100%">
              <InputLabel px={0}>
                <LangDisplay text={form.reminderField.label} />
              </InputLabel>
              <Flex justify="space-between" gap={24}>
                <Reminder
                  date={`${1} ${form.reminderField.month}`}
                  disabled={false}
                  width="100%"
                  isSelected={newReminder === 1}
                  onClick={() => setNewReminder(1)}
                />
                <Reminder
                  date={`${3} ${form.reminderField.months}`}
                  disabled={false}
                  width="100%"
                  isSelected={newReminder === 3}
                  onClick={() => setNewReminder(3)}
                />
                <Reminder
                  date={`${6} ${form.reminderField.months}`}
                  disabled={false}
                  width="100%"
                  isSelected={newReminder === 6}
                  onClick={() => setNewReminder(6)}
                />
              </Flex>
            </Flex>
          </Flex>
          <MessageBox
            text={`${strings.currentReminder} ${
              reminder === 1
                ? form.reminderField.month.toLocaleLowerCase()
                : form.reminderField.months.toLocaleLowerCase()
            }`}
            variables={{ month: reminder }}
            type="info"
          />
        </DialogBoxBody>
      </ScrollableContainer>

      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="primary"
          onClick={e => {
            e.preventDefault();
            setLoading(true);
            updateData(newReminder);
          }}
          type="button"
        >
          <LangDisplay text={lang.strings.buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
