import {
  DialogBoxFooter,
  Button,
  Typography,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Flex,
  Wallet,
} from '@cypherock/cysync-ui';
import React from 'react';

// import { routes } from '~/constants';
// import { useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

const listContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '16px',
  flexDirection: 'column',
  border: '1px solid #2C2520',
  backgroundColor: '#27221D',
};

const listStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
};

const listItemStyle: React.CSSProperties = {
  textAlign: 'left',
  color: 'white',
};

const listItemHeadingStyle: React.CSSProperties = {
  color: '#8B8682',
  textAlign: 'left',
  fontSize: '16px',
  fontWeight: 400,
};

export const ExistingWalletList: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  // const navigateTo = useNavigateTo();
  // const toNextPage = () => navigateTo(routes.onboarding.deviceDetection.path);

  const wallets = ['Wallet 1', 'Wallet 2', 'Wallet 3'];

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Wallet width={50} height={50} />
        <Flex direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.walletList.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" mb={2} color="muted">
            <LangDisplay text={lang.strings.onboarding.walletList.subtitle} />{' '}
          </Typography>
        </Flex>
        <Flex direction="column" gap={16} width="full">
          <div style={listContainerStyle}>
            <ul style={listStyle}>
              {wallets.map(item => (
                <li key={item} style={listItemStyle}>
                  <h6 style={listItemHeadingStyle}>{item}</h6>
                </li>
              ))}
            </ul>
          </div>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="danger">{lang.strings.buttons.notCreated}</Button>
        <Button type="submit" name="confirm">
          {lang.strings.buttons.confirm}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
