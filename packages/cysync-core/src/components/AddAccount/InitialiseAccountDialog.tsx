import {
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyCoinIcon,
  Typography,
  Image,
  Container,
} from '@cypherock/cysync-ui';
import React from 'react';

export const InitialiseAccountDialog: React.FC<{ dataArray: any[] }> = ({
  dataArray,
}) => (
  <div>
    <DialogBox width={500} height={544}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          Add Coin/Account
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody>
        <Image src={verifyCoinIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            Follow instructions on the X1 Vault
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            Add a coin/account Wallet{' '}
            <strong style={{ color: 'white' }}>Cypherock Red</strong>
          </Typography>
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              text={data.text}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  </div>
);
