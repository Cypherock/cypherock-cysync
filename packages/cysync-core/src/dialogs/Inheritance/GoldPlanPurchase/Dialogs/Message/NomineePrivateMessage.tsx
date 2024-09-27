import {
  Button,
  Container,
  Flex,
  InputLabel,
  LangDisplay,
  MessageBox,
  QuestionMarkButton,
  TextAreaInput,
  Tooltip,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';
import { tabIndicies } from '~/dialogs/Inheritance/GoldPlanPurchase/context/useDialogHandler';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const NomineePrivateMessageInput = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase.message;

  const {
    onPrevious,
    onNext,
    cardLocation,
    setCardLocation,
    personalMessage,
    setPersonalMessage,
    haveExecutor,
    goTo,
    isOnSummaryPage,
  } = useInheritanceGoldPlanPurchaseDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            onClick={() => {
              if (isOnSummaryPage) goTo(tabIndicies.summary.tabNumber);
              else if (haveExecutor) onNext();
              else goTo(tabIndicies.reminder.tabNumber, 0);
            }}
            variant="primary"
          >
            <LangDisplay text={lang.strings.buttons.continue} />
          </Button>
        </>
      }
    >
      <Container direction="column" gap={4}>
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
        >
          <LangDisplay text={strings.nominee.title} />
        </Typography>
        <Flex gap={4} align="center">
          <Typography color="muted" $textAlign="center" $fontSize={16}>
            <LangDisplay text={strings.nominee.subtitle} />
          </Typography>
          <Tooltip text={strings.nominee.tooltip} tooltipPlacement="bottom">
            <QuestionMarkButton />
          </Tooltip>
        </Flex>
      </Container>
      <Flex direction="column" $flex={1} width="100%">
        <Flex>
          <InputLabel>{strings.nominee.form.locationField.label}</InputLabel>
          <Tooltip
            text={strings.nominee.form.locationField.tooltip}
            tooltipPlacement="bottom"
          >
            <QuestionMarkButton />
          </Tooltip>
        </Flex>
        <TextAreaInput
          placeholder={strings.nominee.form.locationField.placeholder}
          height={120}
          value={cardLocation}
          onChange={setCardLocation}
        />
        <Flex direction="column" $flex={1} width="100%">
          <Flex>
            <InputLabel>
              {strings.nominee.form.personalMessage.label}
            </InputLabel>
            <Tooltip
              text={strings.nominee.form.personalMessage.tooltip}
              tooltipPlacement="bottom"
            >
              <QuestionMarkButton />
            </Tooltip>
          </Flex>
          <TextAreaInput
            placeholder={strings.nominee.form.personalMessage.placeholder}
            value={personalMessage}
            onChange={setPersonalMessage}
            height={120}
          />
        </Flex>
        <MessageBox type="warning" text={strings.nominee.messageBox.warning} />
      </Flex>
    </Layout>
  );
};
