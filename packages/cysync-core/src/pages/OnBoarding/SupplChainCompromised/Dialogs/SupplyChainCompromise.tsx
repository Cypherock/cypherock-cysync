import {
  DialogBoxFooter,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  CrossCircle,
} from '@cypherock/cysync-ui';
import React from 'react';

// import { routes } from '~/constants';
// import { useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

export const SupplyChainCompromise: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  // const navigateTo = useNavigateTo();
  // const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <CrossCircle />
        <Flex direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay
              text={lang.strings.onboarding.supplyChainCompromised.title}
            />
          </Typography>
          <Typography variant="h6" $textAlign="center" mb={2} color="muted">
            <LangDisplay
              text={lang.strings.onboarding.supplyChainCompromised.subtitle}
            />{' '}
          </Typography>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button type="submit" name="report">
          {lang.strings.buttons.report}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
