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
  importWalletIcon,
} from '@cypherock/cysync-ui';
import { useTheme } from 'styled-components';

export const ImportWalletDialogBox: FC<{
  importWallet: {
    title: string;
    button: string;
    list: Array<string>;
  };
}> = ({ importWallet }) => {
  const theme = useTheme();
  return (
    <DialogBox width="full">
      <DialogBoxBody height="full">
        <Image width={45} src={importWalletIcon} alt="importWalletIcon" />
        <Flex gap={48} direction="column" height="full">
          <Typography $textAlign="center" variant="h5" color="heading" mb={1}>
            <LangDisplay text={importWallet.title} />
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
              {importWallet.list.map((item, index) => (
                <ListItem key={`import-wallet-list-${index + 1}`} width="full">
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
        <Button variant="primary">
          <LangDisplay text={importWallet.button} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
