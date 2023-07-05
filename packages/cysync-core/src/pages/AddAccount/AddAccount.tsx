import React from 'react';
import {
  joystickArrowIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  checkIcon,
  StyledLeanBoxContainer,
  LeanBox,
  halfLoaderGold,
  VerifyCoinIcon,
  Typography,
  Image,
  Container,
} from '@cypherock/cysync-ui';

export const AddAccount: React.FC = () => {
  const dataArray = [
    {
      id: '1', // Add a unique identifier to each data object
      leftImageSrc: joystickArrowIcon,
      rightImageSrc: checkIcon,
      text: 'Verify the coins on the X1 Vault',
    },
    {
      id: '2',
      leftImageSrc: joystickArrowIcon,
      rightImageSrc: halfLoaderGold,
      text: 'Enter passphrase',
    },
    {
      id: '3',
      leftImageSrc: joystickArrowIcon,
      rightImageSrc: '',
      text: 'Enter the PIN and tap any X1 Card',
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
          <Image src={VerifyCoinIcon} alt="Device not connected" />
          <Container display="flex" direction="column" gap={20} width="full">
            <Typography variant="h5" $textAlign="center">
              Follow instructions on the X1 Vault
            </Typography>
            <Typography variant="span" $textAlign="center" color="muted">
              Add a coin/account Wallet{' '}
              <strong style={{ color: 'white' }}>Cypherock Red</strong>
            </Typography>
          </Container>
          <StyledLeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                rightImageSrc={data.rightImageSrc}
                text={data.text}
              />
            ))}
          </StyledLeanBoxContainer>
        </DialogBoxBody>
      </DialogBox>
      {/* <DialogBox width={500} height={503}>
      <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            Add Coin/Account
          </Typography>
        </DialogBoxHeader>
        <DialogBoxBody>
          <Image src={VerifyCoinIcon} alt="Device not connected" />
          <Container display="flex" direction="column" gap={20} width="full">
            <Typography variant="h5" $textAlign="center">
              Follow instructions on the X1 Vault
            </Typography>
            <Typography variant="span" $textAlign="center" color="muted">
              Add a coin/account Wallet{' '}
              <strong style={{ color: 'white' }}>Cypherock Red</strong>
            </Typography>
          </Container>
          <StyledLeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                leftImageSrc={data.leftImageSrc}
                rightImageSrc={data.rightImageSrc}
                text={data.text}
              />
            ))}
          </StyledLeanBoxContainer>
        </DialogBoxBody>
      </DialogBox> */}
    </div>
  );
};
