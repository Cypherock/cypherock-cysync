import { GoldExternalLink, LangDisplay } from '@cypherock/cysync-ui';
import React from 'react';

import { openReleaseNotesDialog } from '~/actions';
import { constants } from '~/constants';
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
        <a
          href={constants.termsOfUseLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <GoldExternalLink width={18} height={18} />
        </a>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.privacyPolicy.title }}
        description={{ text: item.privacyPolicy.description }}
      >
        <a
          href={constants.privacyPolicyLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <GoldExternalLink width={18} height={18} />
        </a>
      </SettingsStandardItem>
    </>
  );
};
