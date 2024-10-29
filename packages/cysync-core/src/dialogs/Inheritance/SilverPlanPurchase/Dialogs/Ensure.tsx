import {
  Button,
  Container,
  LangDisplay,
  Typography,
  ListContainer,
  ListItem,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

export const Ensure = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceSilverPlanPurchase;

  const { onNext } = useInheritanceSilverPlanPurchaseDialog();

  return (
    <Layout
      footerComponent={
        <Button onClick={() => onNext()} variant="primary">
          <LangDisplay text={lang.strings.buttons.next} />
        </Button>
      }
    >
      <Typography variant="h5" color="heading" $textAlign="center">
        <LangDisplay text={strings.instructions.ensure.title} />
      </Typography>
      <Container $bgColor="list" direction="column" $width="full">
        <ListContainer
          py={2}
          pr={3}
          pl={6}
          direction="column"
          width="full"
          gap={16}
        >
          {strings.instructions.ensure.instructions.map((listItem, index) => (
            <ListItem key={`list-item-${index + 1}`} width="full">
              <Typography
                variant="h6"
                color="muted"
                $textAlign="left"
                $letterSpacing={0.05}
              >
                <LangDisplay text={listItem} />
              </Typography>
            </ListItem>
          ))}
        </ListContainer>
      </Container>
    </Layout>
  );
};
