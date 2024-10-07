import {
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Flex,
  InputLabel,
  LangDisplay,
  ScrollableContainer,
  TextAreaInput,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditExecutorMessageDialog } from '../context';

export const EditMessage = () => {
  const lang = useAppSelector(selectLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { onClose } = useInheritanceEditExecutorMessageDialog();
  const strings =
    lang.strings.dialogs.inheritanceEditExecutorMessage.editMessage;
  const { form } = strings;

  if (isLoading) {
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
            <Typography $fontSize={20} color="white">
              <LangDisplay text={strings.title} />
            </Typography>
          </Flex>
          <Flex
            gap={0}
            direction="column"
            align="stretch"
            $flex="1"
            width="100%"
            pt={2}
          >
            <InputLabel $textAlign="left" px={0}>
              <LangDisplay text={form.messageField.label} />
            </InputLabel>
            <TextAreaInput
              placeholder={form.messageField.placeholder}
              value={message}
              onChange={setMessage}
              height={120}
              maxChars={800}
              currentChars={message.length || 0}
            />
          </Flex>
        </DialogBoxBody>
      </ScrollableContainer>

      <DialogBoxFooter py={4} px={5}>
        <Button variant="secondary" onClick={onClose} type="button">
          <LangDisplay text={strings.buttons.exit} />
        </Button>
        <Button
          variant="primary"
          onClick={e => {
            e.preventDefault();
            setIsLoading(true);
          }}
          type="button"
        >
          <LangDisplay text={strings.buttons.save} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
