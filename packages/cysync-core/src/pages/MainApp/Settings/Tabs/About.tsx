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
    <>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.cySyncVersion.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay
              text={item.cySyncVersion.description}
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
            <LangDisplay text={item.termsOfUse.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.termsOfUse.description} />
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
            <LangDisplay text={item.privacyPolicy.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.privacyPolicy.description} />
          </Typography>
        </Flex>
        <Flex>
          <Link to="https://www.cypherock.com/" target="_blank">
            <GoldExternalLink width={18} height={18} />
          </Link>
        </Flex>
      </TabItem>
    </>
  );
};
