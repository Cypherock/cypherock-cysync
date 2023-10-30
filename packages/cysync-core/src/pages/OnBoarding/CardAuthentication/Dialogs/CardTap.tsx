import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
  Container,
  LangDisplay,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import React from 'react';

import { ILangState, selectLanguage, useAppSelector } from '~/store';
import { IParsedError } from '~/utils/error';

export interface CardTapProps {
  tapState: number;
  tapsPerCard: number;
  totalCards: number;
  error?: IParsedError;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

const createCardTapListItem = (params: {
  lang: ILangState;
  tapState: number;
  tapsPerCard: number;
  error: IParsedError | undefined;
  index: number;
}) => {
  const { lang, tapState, tapsPerCard, error, index } = params;

  const isExecuting = Math.floor(tapState / tapsPerCard) === index;

  return {
    text: `${lang.strings.x1Card} #${index + 1}`,
    currentState: tapState - tapsPerCard * index,
    totalState: tapsPerCard,
    currentFailed: isExecuting && !!error,
  };
};

const createCardTapListItems = (params: {
  totalCards: number;
  lang: ILangState;
  tapState: number;
  tapsPerCard: number;
  error: IParsedError | undefined;
}) => {
  const { totalCards, lang, tapState, tapsPerCard, error } = params;

  return Array(totalCards)
    .fill(0)
    .map((_, index) =>
      createCardTapListItem({ lang, tapState, tapsPerCard, error, index }),
    );
};

export const CardTap: React.FC<CardTapProps> = ({
  tapState,
  tapsPerCard,
  totalCards,
  error,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const lang = useAppSelector(selectLanguage);

  const items = createCardTapListItems({
    totalCards,
    lang,
    tapState,
    tapsPerCard,
    error,
  });

  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={48}>
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.cardAuth.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={lang.strings.onboarding.cardAuth.subtext} />
          </Typography>
        </Container>
        <CardTapList items={items} />
        {error && (
          <Container display="block">
            <Typography
              variant="h6"
              color="error"
              $fontWeight="light"
              $textAlign="center"
            >
              {`${error.heading} (${error.code})`}
            </Typography>
            {error.subtext && (
              <Typography
                color="muted"
                $fontWeight="light"
                $textAlign="center"
                $fontSize={14}
                mt={1}
              >
                {error.subtext}
              </Typography>
            )}
          </Container>
        )}
      </DialogBoxBody>
      {error && (
        <DialogBoxFooter>
          {error.secondaryAction && (
            <Button variant="primary" onClick={onSecondaryClick}>
              {error.secondaryAction.text}
            </Button>
          )}
          <Button variant="primary" onClick={onPrimaryClick}>
            {error.primaryAction.text}
          </Button>
        </DialogBoxFooter>
      )}
    </DialogBox>
  );
};

CardTap.defaultProps = {
  error: undefined,
};
