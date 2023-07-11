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

interface Info {
  dialogBox: {
    title: string;
    header: string;
    subheader: string;
    subheader1: string;
    dataArray: {
      id: string;
      leftImageSrc?: any;
      rightImageSrc?: any;
      text: string;
    }[];
  };
}

export const InitialiseAccountDialog: React.FC<{ initAccount: Info }> = ({
  initAccount,
}) => (
  <div>
    <DialogBox width={500} height={544}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          {initAccount.dialogBox.title}
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody>
        <Image src={verifyCoinIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            {initAccount.dialogBox.header}
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            {initAccount.dialogBox.subheader}
            <strong style={{ color: 'white' }}>
              {initAccount.dialogBox.subheader1}
            </strong>
          </Typography>
        </Container>
        <LeanBoxContainer>
          {initAccount.dialogBox.dataArray.map(data => (
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
