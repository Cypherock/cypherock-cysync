import { GoldExternalLink, LangDisplay } from '@cypherock/cysync-ui';
import React from 'react';
import { Link } from 'react-router-dom';

import { openReleaseNotesDialog } from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { SettingsButton, SettingsStandardItem } from '../components';

export const About: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.about;
  const dispatch = useAppDispatch();

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.cySyncVersion.title }}
        description={{
          text: item.cySyncVersion.description,
          variables: { version: window.cysyncEnv.VERSION },
        }}
      >
        <SettingsButton
          onClick={() => dispatch(openReleaseNotesDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.details} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.termsOfUse.title }}
        description={{ text: item.termsOfUse.description }}
      >
        <Link to="https://www.cypherock.com/" target="_blank">
          <GoldExternalLink width={18} height={18} />
        </Link>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.privacyPolicy.title }}
        description={{ text: item.privacyPolicy.description }}
      >
        <Link to="https://www.cypherock.com/" target="_blank">
          <GoldExternalLink width={18} height={18} />
        </Link>
      </SettingsStandardItem>
    </>
  );
};
