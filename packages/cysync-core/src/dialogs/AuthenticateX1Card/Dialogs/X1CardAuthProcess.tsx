import {
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Typography,
  CloseButton,
  Flex,
  Divider,
  Image,
  DeviceScreenConfirm,
  LeanBoxProps,
  ArrowRightIcon,
  checkIcon,
  LeanBoxContainer,
  LeanBox,
  AlertBox,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAuthenticateX1CardDialog } from '../context';

export const X1CardAuthProcess: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useAuthenticateX1CardDialog();
  const { dialogs } = lang.strings;
  const { authX1Card } = dialogs.auth;

  const rightArrowIcon = <ArrowRightIcon />;

  const stepsList: LeanBoxProps[] = [
    {
      id: '1',
      text: authX1Card.steps.confirmDevice,
      leftImage: rightArrowIcon,
      rightImage: (
        <Image src={checkIcon} alt={authX1Card.steps.confirmDevice} />
      ),
    },
  ];

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} p={0} m={0} align="stretch">
        <Flex
          pt={4}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
          gap={{ def: 16, lg: 32 }}
          direction="column"
          align="center"
        >
          <DeviceScreenConfirm width={264} />
          <Flex direction="column" gap={4} align="center">
            <Typography color="white" $fontSize={20} $textAlign="center">
              <LangDisplay text={authX1Card.title} />
            </Typography>
            <Typography color="muted" $fontSize={16} $textAlign="center">
              <LangDisplay text={authX1Card.description} />
            </Typography>
          </Flex>
        </Flex>
        <Flex
          pt={2}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
          gap={8}
          direction="column"
          align="stretch"
        >
          <LeanBoxContainer>
            {stepsList.map(data => (
              <LeanBox key={data.id} {...data} color="white" disabled={false} />
            ))}
          </LeanBoxContainer>
        </Flex>
        <Flex
          pt={2}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
          gap={8}
          direction="column"
          align="stretch"
        >
          <AlertBox
            subAlert={authX1Card.info}
            variant="warning" /** TODO: Update Variant Icon */
          />
        </Flex>
      </DialogBoxBody>
    </DialogBox>
  );
};
