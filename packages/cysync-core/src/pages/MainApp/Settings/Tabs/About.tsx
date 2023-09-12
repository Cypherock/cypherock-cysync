import React from 'react';
import {
  Flex,
  GoldExternalLink,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import { SettingsButton, TabItem } from '../components';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { openCySyncVersionDetailsDialog } from '~/actions';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.about;
  const dispatch = useAppDispatch();

  return (
    <Flex
      $alignSelf="stretch"
      direction="column"
      align="stretch"
      px={{ def: 3, lg: 5 }}
      py={{ def: 2, lg: 4 }}
      gap={32}
    >
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.cySyncVersion} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay
              text={item.cySyncVersionDesc}
              variables={{ version: window.cysyncEnv.VERSION }}
            />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton
            variant="primary"
            onClick={() => dispatch(openCySyncVersionDetailsDialog())}
          >
            <LangDisplay text={strings.buttons.details} />
          </SettingsButton>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.termsOfUse} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.termsOfUseDesc} />
          </Typography>
        </Flex>
        <Flex>
          <Link to="https://www.cypherock.com/" target="_blank">
            <GoldExternalLink width={18} height={18} />
          </Link>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.privacyPolicy} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.privacyPolicyDesc} />
          </Typography>
        </Flex>
        <Flex>
          <Link to="https://www.cypherock.com/" target="_blank">
            <GoldExternalLink width={18} height={18} />
          </Link>
        </Flex>
      </TabItem>
    </Flex>
  );
};
