import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  Flex,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  MessageBox,
  ScrollableContainer,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePlanLoginDialog } from '../context';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const WalletAuth: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, startWalletAuth } = useInheritancePlanLoginDialog();

  const strings = lang.strings.dialogs.inheritancePlanLogin;

  const deviceEvents: Record<number, boolean | undefined> = {
    0: true,
  };

  const getDeviceEventIcon = (
    loadingEvent: SignTransactionDeviceEvent,
    completedEvent: SignTransactionDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIconComponent;
    if (deviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.walletAuth.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
    ];

    return actions;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startWalletAuth();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <DialogBox width={800} onClose={onClose} $maxHeight="90vh">
      <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody px={5} py={4} gap={0}>
          <Flex
            direction="column"
            align="center"
            justify="center"
            $width="100%"
          >
            <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
              {strings.walletAuth.title}
            </Typography>
            <LeanBoxContainer mb={4}>
              {actionsList.map(data => (
                <LeanBox
                  key={data.id}
                  leftImage={data.leftImage}
                  rightImage={data.rightImage}
                  text={data.text}
                  image={data.image}
                  altText={data.altText}
                  id={data.id}
                />
              ))}
            </LeanBoxContainer>
            <MessageBox
              type="warning"
              text={strings.walletAuth.messageBox.warning}
              showIcon
            />
          </Flex>
        </DialogBoxBody>
      </ScrollableContainer>
    </DialogBox>
  );
};
