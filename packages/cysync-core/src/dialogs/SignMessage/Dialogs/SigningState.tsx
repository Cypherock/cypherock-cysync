import {
  Container,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Image,
  CloseButton,
  Flex,
  Divider,
  LeanBoxProps,
  ArrowRightIcon,
  checkIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { Title } from './components';

import { useSignMessageDialog } from '../context';

export const ViewSigningStateDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { signMessage } = lang.strings;
  const { onClose } = useSignMessageDialog();

  const rightArrowIcon = <ArrowRightIcon />;

  const actionsList: LeanBoxProps[] = [
    {
      id: '1',
      text: signMessage.info.confirmDevice,
      leftImage: rightArrowIcon,
      rightImage: (
        <Image src={checkIcon} alt={signMessage.info.confirmDevice} />
      ),
    },
    {
      id: '2',
      text: signMessage.info.verifyData,
      leftImage: rightArrowIcon,
      rightImage: <Image src={checkIcon} alt={signMessage.info.verifyData} />,
    },
    {
      id: '3',
      text: signMessage.info.enterPinTapCard,
      leftImage: rightArrowIcon,
      rightImage: (
        <Image src={checkIcon} alt={signMessage.info.enterPinTapCard} />
      ),
    },
  ];

  return (
    <DialogBox width={500} align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody gap={0} pt={0} pr={0} pb={0} pl={0} align="stretch">
        <Title />
        <Container
          align="stretch"
          display="flex"
          direction="column"
          pt={2}
          pb={4}
          px={5}
        >
          <LeanBoxContainer>
            {actionsList.map(data => (
              <LeanBox key={data.id} {...data} color="white" disabled={false} />
            ))}
          </LeanBoxContainer>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
