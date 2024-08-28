import {
  DialogBox,
  Flex,
  Image,
  loaderGrayIcon,
  Typography,
} from '@cypherock/cysync-ui';
import { sleep } from '@cypherock/cysync-utils';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePlanLoginDialog } from '../context';

export const FetchData: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritancePlanLoginDialog();

  const strings = lang.strings.dialogs.inheritancePlanLogin.fetchData;

  useEffect(() => {
    sleep(2000).then(onClose);
  }, []);

  return (
    <DialogBox width={500} height={300} gap={32}>
      <Image
        src={loaderGrayIcon}
        $width={68}
        alt="Loader icon"
        animate="spin"
        $animDuration={3}
      />
      <Flex direction="column" align="center" justify="center" $width="100%">
        <Typography $fontSize={20} $textAlign="center" color="white" mb="4px">
          {strings.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted">
          {strings.subTitle}
        </Typography>
      </Flex>
    </DialogBox>
  );
};
