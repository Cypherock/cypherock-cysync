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
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

export const WalletActionSection: FC<{
  icon: string;
  title: string;
  button: string;
  list?: string[];
  onClick?: () => void;
  isMiniOnly?: boolean;
}> = ({ title, button, list, icon, onClick, isMiniOnly }) => (
  <DialogBox
    display={isMiniOnly ? { def: 'flex', lg: 'none' } : undefined}
    width="full"
  >
    <DialogBoxBody height="full">
      <Image $width={45} src={icon} alt="importWalletIcon" />
      <Flex gap={48} direction="column" height="full">
        <Typography $textAlign="center" variant="h5" color="heading" mb={1}>
          <LangDisplay text={title} />
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
            {list?.map((item, index) => (
              <ListItem key={`list-item-${index + 1}`} width="full">
                <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
                  {item}
                </Typography>
              </ListItem>
            ))}
          </ListContainer>
        </Container>
      </Flex>
    </DialogBoxBody>
    <DialogBoxFooter>
      <Button onClick={onClick} variant="primary">
        <LangDisplay text={button} />
      </Button>
    </DialogBoxFooter>
  </DialogBox>
);

WalletActionSection.defaultProps = {
  list: undefined,
  onClick: undefined,
  isMiniOnly: false,
};
