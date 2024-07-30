import React, { useEffect, useState } from 'react';
import { useInheritanceEditExecutorMessageDialog } from '../context';
import { LoaderDialog } from '~/components';
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
import { selectLanguage, useAppSelector } from '~/store';

export const EditMessage = () => {
  const lang = useAppSelector(selectLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { onClose } = useInheritanceEditExecutorMessageDialog();
  const strings =
    lang.strings.dialogs.inheritanceEditExecutorMessage.editMessage;
  const { form } = strings;

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
        <DialogBoxBody px={5} py={4} gap={0}>
          <Flex px={5} gap={0} pb={4} direction="column" align="center">
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
          >
            <InputLabel>
              <LangDisplay text={form.messageField.label} />
            </InputLabel>
            <TextAreaInput
              placeholder={form.messageField.placeholder}
              value={message}
              onChange={setMessage}
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
            console.log('saving changes');
          }}
          type="button"
        >
          <LangDisplay text={strings.buttons.save} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
