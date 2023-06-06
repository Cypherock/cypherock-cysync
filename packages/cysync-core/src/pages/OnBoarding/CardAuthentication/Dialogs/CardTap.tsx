import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
  Container,
  Button,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const CardTap: React.FC<{
  tapState: number;
  tapsPerCard: number;
  totalCards: number;
}> = ({ tapState, tapsPerCard, totalCards }) => {
  const lang = useAppSelector(selectLanguage);
  const items = Array(totalCards)
    .fill(0)
    .map((_, i) => ({
      text: `${lang.strings.x1Card} #${i + 1}`,
      currentState: tapState - tapsPerCard * i,
      totalState: tapsPerCard,
    }));
  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={48}>
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.cardAuth.title} /> (
            <Button variant="none" color="golden">
              <Typography variant="h5" color="gold">
                ?
              </Typography>
            </Button>
            )
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={lang.strings.onboarding.cardAuth.subtext} />
          </Typography>
        </Container>
        <CardTapList items={items} />
      </DialogBoxBody>
    </DialogBox>
  );
};
