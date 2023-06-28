import { Container, ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

export const Congratulations: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  useEffect(() => {
    // delay chosen according to confetti blast animation
    navigateTo(routes.portfolio.path, 3800);
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
