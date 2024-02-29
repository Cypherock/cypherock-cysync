import {
  DialogBoxFooter,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  WalletIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

// import { routes } from '~/constants';
// import { useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

export const ExistingWalletList: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  // const navigateTo = useNavigateTo();
  // const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <WalletIcon width={50} height={50} />
        <Flex direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.walletList.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" mb={2} color="muted">
            <LangDisplay text={lang.strings.onboarding.walletList.subtitle} />{' '}
          </Typography>
        </Flex>

        <Flex direction="column" gap={16} width="full">
          <div>
            <ul>
              <li style={{ textAlign: 'left', color: 'white' }}>
                <Typography color="white" variant="h6" $textAlign="left" />
                Wallet 1
              </li>
              <li style={{ textAlign: 'left', color: 'white' }}>
                <Typography color="white" variant="h6" $textAlign="left" />
                Wallet 2
              </li>
              <li style={{ textAlign: 'left', color: 'white' }}>
                <Typography color="white" variant="h6" $textAlign="left" />
                Wallet 3
              </li>
            </ul>
          </div>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="danger" onClick={removeEmail}>
          {lang.strings.buttons.notCreated}
        </Button>
        <Button type="submit" isLoading={isLoading} name="email">
          {lang.strings.buttons.confirm}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
