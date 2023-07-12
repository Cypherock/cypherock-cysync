import {
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
  settingsIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

interface AddAccountDialogProps {
  addAccount: {
    info: {
      dialogBox: {
        title?: string;
        header?: string;
        subheader: string;
        submitButton?: string;
        advanced: string;
        dataArray: Array<{
          id: string;
          leftImageSrc: any;
          rightText?: string;
          text: string;
          checkBox: boolean;
          tag?: string;
          displayRadioButton?: boolean;
        }>;
      };
    };
  };
}

export const AddAccountDialog: React.FC<AddAccountDialogProps> = ({
  addAccount,
}) => {
  const { title, header, subheader, submitButton, advanced, dataArray } =
    addAccount.info.dialogBox;

  return (
    <div>
      <DialogBox width={500} height={544}>
        <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            {title}
          </Typography>
        </DialogBoxHeader>
        <DialogBoxBody>
          <Image src={settingsIcon} alt="Loader" />
          <Typography variant="h5" $textAlign="center">
            {header}
          </Typography>
          <div>
            <InputLabel mt={4} mr={2} mb={1}>
              {subheader}
            </InputLabel>
            <LeanBoxContainer padding="0px">
              {dataArray.map(data => (
                <LeanBox
                  key={data.id}
                  leftImageSrc={data.leftImageSrc}
                  rightText={data.rightText}
                  text={data.text}
                  color="heading"
                  textVariant="fineprint"
                  tag={data.tag}
                  checkBox={data.checkBox}
                  id={data.id}
                  displayRadioButton={data.displayRadioButton}
                />
              ))}
            </LeanBoxContainer>
            <InputLabel
              className="gold-label"
              fontSize="13px"
              fontWeight="400"
              textAlign="right"
              mt={1}
            >
              {advanced}
            </InputLabel>
          </div>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button variant="primary">{submitButton}</Button>
        </DialogBoxFooter>
      </DialogBox>
    </div>
  );
};
