import { InheritanceWalletAuthDeviceEvent } from '@cypherock/app-support-inheritance';
import {
  ArrowRightIcon,
  Check,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  Flex,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  ScrollableContainer,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { WalletAuthLoginStep } from '../../hooks';
import { useInheritancePlanLoginDialog } from '../context';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const WalletAuth: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritancePlanLogin;

  const {
    onClose,
    onNext,
    walletAuthDeviceEvents,
    walletAuthStep,
    walletAuthStart,
    walletAuthAbort,
    retryIndex,
    clearErrors,
    walletName,
  } = useInheritancePlanLoginDialog();

  const getDeviceEventIcon = (
    loadingEvent: InheritanceWalletAuthDeviceEvent,
    completedEvent: InheritanceWalletAuthDeviceEvent,
  ) => {
    if (walletAuthDeviceEvents[completedEvent]) return checkIconComponent;
    if (walletAuthDeviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.walletAuth.actions.confirm,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.INIT,
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
        ),
      },
      {
        id: '2',
        text: strings.walletAuth.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
          InheritanceWalletAuthDeviceEvent.WALLET_BASED_CARD_TAPPED,
        ),
      },
    ];

    return actions;
  }, [strings, walletAuthDeviceEvents]);

  useEffect(() => {
    clearErrors();
    walletAuthStart();

    return () => {
      walletAuthAbort();
    };
  }, [retryIndex, clearErrors]);

  useEffect(() => {
    if (walletAuthStep > WalletAuthLoginStep.walletAuth) {
      onNext();
    }
  }, [walletAuthStep]);

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
            <Video
              src={tapAnyCardDeviceAnimation2DVideo}
              autoPlay
              loop
              $width={506}
              $height={285}
              mb={4}
            />
            <Flex direction="column" gap={4} mb={4}>
              <Typography $fontSize={20} $textAlign="center" color="white">
                {strings.walletAuth.title}
              </Typography>
              <Typography $fontSize={16} $textAlign="center" color="muted">
                <LangDisplay text={strings.walletAuth.subTitle} />
                <Typography variant="span" $fontSize={16}>
                  {walletName}
                </Typography>
              </Typography>
            </Flex>
            <LeanBoxContainer>
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
          </Flex>
        </DialogBoxBody>
      </ScrollableContainer>
    </DialogBox>
  );
};
