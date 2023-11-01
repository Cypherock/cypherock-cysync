import { ConfettiBlast, Container, SuccessDialog } from '@cypherock/cysync-ui';
import { sleep } from '@cypherock/cysync-utils';
import React, { useEffect } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { routes } from '~/constants';
import { useDevice } from '~/context';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

export const Congratulations: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const { disconnectDevice } = useDevice();
  const dispatch = useAppDispatch();

  const updateIsOnboardingCompleted = async () => {
    await keyValueStore.isOnboardingCompleted.set(true);
  };

  const confettiAfterEffects = async () => {
    // delay chosen according to confetti blast animation
    await sleep(3800);
    navigateTo(routes.portfolio.path);
    dispatch(openWalletActionsDialog());
  };

  useEffect(() => {
    disconnectDevice();
    updateIsOnboardingCompleted();
    confettiAfterEffects();
  }, []);

  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      <ConfettiBlast />
      <SuccessDialog
        title={lang.strings.onboarding.success.title}
        subtext={lang.strings.onboarding.success.subtext}
      />
    </Container>
  );
};
