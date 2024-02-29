import {
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  Image,
  questionMarkGoldIcon,
} from '@cypherock/cysync-ui';
import React, { KeyboardEvent, useState } from 'react';

// import { routes } from '~/constants';
// import { useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

const StepRadioButtons = () => {
  const stepsColor: Record<number, string> = {
    1: 'green',
    2: '#E9B873',
  };

  const getCircleStyle = (step: number) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: stepsColor[step],
    display: 'inline-block',
    cursor: 'pointer',
    border: '1px solid gray',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
      {Object.keys(stepsColor).map(step => (
        <div key={step} style={getCircleStyle(parseInt(step, 10))} />
      ))}
    </div>
  );
};

const getStyles = (cardId: number, focusedCardId: number | null): any => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: '50%',
  height: '50px',
  border: `1px solid ${focusedCardId === cardId ? '#E9B873' : '#3C3C3C'}`,
  color: `${focusedCardId === cardId ? '#E9B873' : 'gray'}`,
  borderRadius: '15px',
  marginBottom: '5px',
});

export const CardList: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  // const navigateTo = useNavigateTo();
  // const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);
  const [focusedCardId, setFocusedCardId] = useState<number | null>(null);

  const handleFocus = (cardId: number) => {
    setFocusedCardId(cardId);
  };

  const handleKeyPress = (
    event: KeyboardEvent<HTMLDivElement>,
    cardId: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleFocus(cardId);
    }
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Flex direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.cardBeep2Wallet.title} />
            <Image src={questionMarkGoldIcon} alt="Qiestion Icon" />
          </Typography>
          <Typography variant="h6" $textAlign="center" mb={2} color="muted">
            <LangDisplay
              text={lang.strings.onboarding.cardBeep2Wallet.subtitle}
            />
          </Typography>
          <Flex direction="column" width="full">
            {[1, 2, 3, 4].map(cardId => (
              <div
                key={cardId}
                style={getStyles(cardId, focusedCardId)}
                onClick={() => handleFocus(cardId)}
                onKeyPress={event => handleKeyPress(event, cardId)}
                role="button"
                tabIndex={0}
                aria-pressed={focusedCardId === cardId}
              >
                X1 Card #{cardId} <StepRadioButtons />
              </div>
            ))}
          </Flex>
        </Flex>
      </DialogBoxBody>
    </DialogBox>
  );
};
