import React, { FC } from 'react';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  ListContainer,
  ListItem,
  Typography,
  addWalletIcon,
} from '@cypherock/cysync-ui';
import { useTheme } from 'styled-components';
import { useCreateNewWallet } from '~/context/createNewWallet';

export const CreateWalletDialogBox: FC<{
  createWallet: {
    title: string;
    button: string;
    list: Array<string>;
  };
}> = ({ createWallet }) => {
  const theme = useTheme();
  const { setShowCreateWalletDialogBox, setShowWalletActionsDialogBox } =
    useCreateNewWallet();
  return (
    <DialogBox width="full">
      <DialogBoxBody height="full">
        <Image width={45} src={addWalletIcon} alt="importWalletIcon" />
        <Flex gap={48} direction="column" height="full">
          <Typography $textAlign="center" variant="h5" color="heading" mb={1}>
            <LangDisplay text={createWallet.title} />
          </Typography>
          <Container
            display={{
              def: 'none',
              lg: 'flex',
            }}
            justify="flex-start"
            height="full"
            $bgColor="list"
            direction="column"
          >
            <ListContainer p={4} direction="column" width="full">
              {createWallet.list.map((item, index) => (
                <ListItem key={`create-wallet-list-${index + 1}`} width="full">
                  <Typography
                    variant="h6"
                    color="muted"
                    $textAlign="left"
                    mb={2}
                  >
                    {item}(
                    <span
                      style={{
                        background: theme?.palette.golden,
                        WebkitTextFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                      }}
                    >
                      ?
                    </span>
                    )
                  </Typography>
                </ListItem>
              ))}
            </ListContainer>
          </Container>
        </Flex>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          onClick={() => {
            setShowCreateWalletDialogBox(true);
            setShowWalletActionsDialogBox(false);
          }}
          variant="primary"
        >
          <LangDisplay text={createWallet.button} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
