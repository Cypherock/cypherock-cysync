import React from 'react';
import {
  loaderGrayIcon,
  etheriumBlueIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  StyledLeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';

export const SyncAccount: React.FC = () => {
  const dataArray = [
    {
      id: '1', // Add a unique identifier to each data object
      leftImageSrc: etheriumBlueIcon,
      rightText: '2.35 ETH',
      text: 'Etherium 1',
    },
    {
      id: '2',
      leftImageSrc: etheriumBlueIcon,
      rightText: '0.77 ETH',
      text: 'Etherium 2',
    },
    {
      id: '3',
      leftImageSrc: etheriumBlueIcon,
      rightText: '0.08 ETH',
      text: 'Etherium 3',
    },
  ];

  return (
    <div>
      <DialogBox width={500} height={544}>
        <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            Add Coin/Account
          </Typography>
        </DialogBoxHeader>
        <DialogBoxBody>
          <Image src={loaderGrayIcon} alt="Loader" />
          <Typography
            variant="h5"
            $textAlign="center"
            padding="0px 0px 0px 0px"
          >
            Syncing the accounts
          </Typography>
          <div>
            <InputLabel margin="32px 8px 8px 0px">
              Accounts already in portfolio ({dataArray.length})
            </InputLabel>
            <StyledLeanBoxContainer padding="0px">
              {dataArray.map(data => (
                <LeanBox
                  key={data.id} // Add a unique identifier to each LeanBox
                  leftImageSrc={data.leftImageSrc}
                  rightText={data.rightText}
                  text={data.text}
                  color="heading" // Set the desired color value for text and rightText
                  textVariant="fineprint" // Set the desired variant for text
                  rightTextVariant="fineprint" // Set the desired variant for rightText
                  rightTextColor="muted" // Set the desired color value for rightText
                  variant="custom" // Set the desired variant for the LeanBox
                />
              ))}
            </StyledLeanBoxContainer>
          </div>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button variant="gold">Stop Syncing</Button>
        </DialogBoxFooter>
      </DialogBox>
    </div>
  );
};
