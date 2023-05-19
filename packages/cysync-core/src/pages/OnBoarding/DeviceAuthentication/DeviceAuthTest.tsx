import React, { ReactElement, useEffect, useState } from 'react';
import {
  Container,
  Flex,
  Image,
  Typography,
  emailIcon,
} from '@cypherock/cysync-ui';
import { Aside } from '@cypherock/cysync-ui/src/components/molecules/Aside';
import {
  configError,
  greenTick,
  loader,
  redCross,
  serverError,
} from '../../../assets/images/onboarding';

const deviceAuthStatesObj: Record<string, { icon: string; text: string }> = {
  loading: {
    icon: loader,
    text: 'Your X1 Vault will now be authenticated through Cypherock to check its authenticity (?)',
  },
  success: {
    icon: greenTick,
    text: 'Your X1 Vault is successfully authenticated',
  },
  serverError: {
    icon: serverError,
    text: 'There seems to be a server error. Retry by reconnecting the device first. If the problem persist, contact support.',
  },
  firmwareError: {
    icon: redCross,
    text: 'There seems to be an error with the ATECC firmware. Contact Cypherock support immmediately.',
  },
  configError: {
    icon: configError,
    text: 'Device seems to be misconfigured. Contact Cypherock support immediately',
  },
};

export const DeviceAuthTest = (): ReactElement => {
  const [state, setState] = useState('loading');

  useEffect(() => {
    setInterval(() => {
      const statesArray = Object.keys(deviceAuthStatesObj);
      let idx = statesArray.indexOf(state);

      if (idx + 1 === statesArray.length) {
        idx = 0;
      } else idx += idx;

      setState(statesArray[idx]);
    }, 5000);
  }, []);

  return (
    <Container height="screen" $bgColor="sideBar">
      <Aside
        asideImage="deviceAuth"
        progress={2}
        title="Device Authentication"
      />
      <Container
        $bgColor="contentGradient"
        height="full"
        width="full"
        align="center"
        position="relative"
        justify="center"
      >
        <Flex
          position="absolute"
          $leftL={40}
          left={12}
          top={14.58}
          $topL={40}
          gap={12}
          align="center"
        >
          <Image src={emailIcon} alt="back" />
          <Typography color="muted">prashant@cypherock.com</Typography>
        </Flex>
        <Flex
          position="absolute"
          $rightL={36}
          right={12}
          top={12}
          $topL={37}
          gap={12}
          align="center"
        >
          <Typography color="muted">Help</Typography>
          <Typography color="gold">?</Typography>
        </Flex>
        <Container
          $bgColor="primary"
          align="center"
          justify="center"
          width={500}
          height={267}
          shadow="popup"
          rounded={16}
          px={3}
          py={3}
        >
          <Flex direction="column" gap={26} align="center" justify="center">
            <Image src={deviceAuthStatesObj[state].icon} alt="icon" />
            <Typography variant="h5" $textAlign="center">
              {deviceAuthStatesObj[state].text}
            </Typography>
          </Flex>
        </Container>
      </Container>
    </Container>
  );
};
