import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const Greeting = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.checkout.greeting;
  return (
    <SuccessDialog
      title={strings.title}
      subtext={strings.subtext}
      buttonText={lang.strings.buttons.done}
      variant="gold"
      handleClick={() => {
        // TODO: implement this function
      }}
    />
  );
};
