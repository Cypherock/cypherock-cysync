import { Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import React from 'react';

import { useWalletConnect } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

export const Title: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { connectionClientMeta } = useWalletConnect();
  return (
    <Flex direction="column" py={4} px={5}>
      <Typography variant="h5" $textAlign="center">
        <LangDisplay text={lang.strings.signMessage.title} />
      </Typography>
      <Typography variant="span" color="muted">
        <LangDisplay text={connectionClientMeta?.url ?? ''} />
      </Typography>
    </Flex>
  );
};
