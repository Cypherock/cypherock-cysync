import {
  LangDisplay,
  disconnectedIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Flex,
  Typography,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useAppSelector } from '~/store';

export const ConnectDevice: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const connect = lang.addAccount.connectDevice.info.dialogBox;

  return (
    <div>
      <DialogBox width={500}>
        <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            <LangDisplay text={connect.title} />
          </Typography>
        </DialogBoxHeader>

        <DialogBoxBody pb={4} pt={4}>
          <Image src={disconnectedIcon} alt="Device not connected" />
          <Flex direction="column" gap={4}>
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={connect.header} />
            </Typography>
          </Flex>
        </DialogBoxBody>
      </DialogBox>
    </div>
  );
};
