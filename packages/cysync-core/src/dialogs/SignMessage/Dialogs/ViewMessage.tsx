import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  DialogBoxHeader,
  Flex,
  ScrollContainer,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useSignMessageDialog } from '../context';
import { CoinIcon } from '~/components';

export const ViewMessageDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { buttons, signMessage } = lang.strings;
  const { message, dapp, wallet, account, onNext, onClose } =
    useSignMessageDialog();

  return (
    <DialogBox width={500} $maxHeight="90vh">
      <DialogBoxHeader py={2}>
        <span style={{ height: '24px', width: '100%' }} />
      </DialogBoxHeader>
      <DialogBoxBody pt={0} pr={0} pb={0} pl={0} gap={0}>
        <Container display="flex" direction="column" py={4} px={5}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={signMessage.title} />
          </Typography>
          <Typography variant="span" color="muted">
            <LangDisplay text={dapp.url} />
          </Typography>
        </Container>
        <Container
          display="flex"
          direction="column"
          gap={24}
          pt={2}
          pb={4}
          px={5}
        >
          <Container display="flex" direction="column" py={2} gap={16}>
            <Typography
              variant="h5"
              color="muted"
              $fontWeight="medium"
              $textAlign="center"
            >
              <LangDisplay text={signMessage.subTitle} />
            </Typography>
            <Flex gap={12} align="center">
              <Typography variant="span" $fontWeight="medium">
                <LangDisplay text={wallet.name} />
              </Typography>
              <Typography variant="span" $fontWeight="medium">
                /
              </Typography>
              <Flex gap={8} align="center">
                <CoinIcon assetId={account.assetId} size={16} />
                <Typography variant="span" $fontWeight="medium">
                  <LangDisplay text={account.name} />
                </Typography>
              </Flex>
            </Flex>
          </Container>
          <ScrollContainer
            style={{ background: 'none', paddingLeft: 0, paddingRight: 0 }}
          >
            <Container
              shrink={1}
              display="flex"
              direction="column"
              align="stretch"
              px={2}
              py={2}
              $bgColor="black"
            >
              {message?.split('\n').map(para => (
                <Typography color="muted" key={para}>
                  {para.length ? para : <span>&nbsp;</span>}
                </Typography>
              ))}
            </Container>
          </ScrollContainer>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.reject} />
        </Button>
        <Button
          variant="primary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
