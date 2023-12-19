import { ConfettiBlast, Container, SuccessDialog } from '@cypherock/cysync-ui';
import { sleep } from '@cypherock/cysync-utils';
import React, { useEffect } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { routes } from '~/constants';
import { useDevice } from '~/context';
import { useNavigateTo, useQuery } from '~/hooks';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

export const Congratulations: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const { reconnectDevice } = useDevice();
  const dispatch = useAppDispatch();
  const query = useQuery();

  const doShowUI = query.get('noUI') !== 'true';

  const updateIsOnboardingCompleted = async () => {
    await keyValueStore.isOnboardingCompleted.set(true);
  };

  const goToMain = () => {
    navigateTo(routes.portfolio.path);
    dispatch(openWalletActionsDialog());
  };

  const confettiAfterEffects = async () => {
    // delay chosen according to confetti blast animation
    await sleep(3800);
    goToMain();
  };

  useEffect(() => {
    reconnectDevice();
    updateIsOnboardingCompleted();
    if (doShowUI) {
      confettiAfterEffects();
    } else {
      goToMain();
    }
  }, []);

  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      {doShowUI && (
        <>
          <ConfettiBlast />
          <SuccessDialog
            title={lang.strings.onboarding.success.title}
            subtext={lang.strings.onboarding.success.subtext}
          />
        </>
      )}
    </Container>
  );
};
