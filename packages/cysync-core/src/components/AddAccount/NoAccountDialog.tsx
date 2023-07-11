import {
  loaderGrayIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import React from 'react';

interface Info {
  dialogBox: {
    title: string;
    header: string;
    subheader: string;
    dataArray: {
      id: string;
      leftImageSrc?: any;
      rightText?: string;
      text: string;
    }[];
  };
}

export const NoAccountDialog: React.FC<{ noAccount: Info }> = ({
  noAccount,
}) => (
  <div>
    <DialogBox width={500} height={544}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          {noAccount.dialogBox.title}
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody>
        <Image src={loaderGrayIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center" padding="0px 0px 0px 0px">
          {noAccount.dialogBox.header}
        </Typography>
        <div>
          <InputLabel margin="32px 8px 8px 0px">
            {noAccount.dialogBox.subheader} (
            {noAccount.dialogBox.dataArray.length})
          </InputLabel>
          <LeanBoxContainer padding="0px">
            {noAccount.dialogBox.dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                rightText={data.rightText}
                text={data.text}
                color="heading"
                textVariant="fineprint"
                rightTextVariant="fineprint"
                rightTextColor="muted"
              />
            ))}
          </LeanBoxContainer>
        </div>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary">Sync Again</Button>
        <Button variant="primary">Close</Button>
      </DialogBoxFooter>
    </DialogBox>
  </div>
);
