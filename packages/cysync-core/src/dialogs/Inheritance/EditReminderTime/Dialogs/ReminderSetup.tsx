import React, { useEffect, useState } from 'react';
import { LoaderDialog } from '~/components';
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
import { selectLanguage, useAppSelector } from '~/store';
import { useInheritanceEditReminderTimeDialog } from '../context';

export const ReminderSetup = () => {
  const lang = useAppSelector(selectLanguage);
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState(1);
  const { onClose, updateData } = useInheritanceEditReminderTimeDialog();
  const strings =
    lang.strings.dialogs.inheritanceEditReminderTime.reminderSetup;
  const { form } = strings;

  useEffect(() => {
    setLoading(false);
    setReminder(1);
  }, []);

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
        <DialogBoxBody px={5} py={4} gap={0}>
          <Flex px={5} gap={0} pb={4} direction="column" align="center">
            <Typography $fontSize={20} color="white">
              <LangDisplay text={strings.title} />
            </Typography>
          </Flex>
          <Flex gap={16} pb={4} direction="column" align="stretch">
            <Accordion
              id="ReminderInfo"
              title={strings.reminderInfo.subtitle}
              content={strings.reminderInfo.subtext}
            />
            <Flex direction="column" align="stretch" $flex="1" width="100%">
              <InputLabel>
                <LangDisplay text={form.field.reminder.label} />
              </InputLabel>
              <Flex justify="space-between" gap={16}>
                <Reminder
                  date={`${1} ${form.field.reminder.month}`}
                  disabled={false}
                  width="100%"
                />
                <Reminder
                  date={`${3} ${form.field.reminder.months}`}
                  disabled={false}
                  width="100%"
                />
                <Reminder
                  date={`${6} ${form.field.reminder.months}`}
                  disabled={false}
                  width="100%"
                />
              </Flex>
            </Flex>
          </Flex>
          <MessageBox
            text={`${strings.currentReminder} ${reminder} ${form.field.reminder.month}`}
            type="info"
          />
        </DialogBoxBody>
      </ScrollableContainer>

      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="secondary"
          onClick={e => {
            e.preventDefault();
            console.log('exiting without saving');
          }}
          type="button"
        >
          <LangDisplay text={strings.buttons.back} />
        </Button>
        <Button
          variant="primary"
          onClick={e => {
            e.preventDefault();
            setLoading(true);
            updateData();
          }}
          type="button"
        >
          <LangDisplay text={strings.buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
