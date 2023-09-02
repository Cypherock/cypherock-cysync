import React from 'react';
import { Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import { TabItem } from '../components';
import { selectLanguage, useAppSelector } from '~/store';

export const About: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.about;

  return (
    <Flex
      $alignSelf="stretch"
      direction="column"
      align="stretch"
      px={5}
      py={4}
      gap={32}
    >
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.cySyncersion} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay
              text={item.cySyncersionDesc}
              variables={{ version: window.cysyncEnv.VERSION }}
            />
          </Typography>
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
      </TabItem>
    </Flex>
  );
};
