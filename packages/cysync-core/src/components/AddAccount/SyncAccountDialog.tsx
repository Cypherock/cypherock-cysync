import React from 'react';
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
  LangDisplay,
} from '@cypherock/cysync-ui';
import { useAppSelector } from '~/store';

export const SyncAccountDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const sync = lang.addAccount.syncAccount.info.dialogBox;

  return (
    <div>
      <DialogBox width={500} height={544}>
        <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            <LangDisplay text={sync.title} />
          </Typography>
        </DialogBoxHeader>
        <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
          <Image src={loaderGrayIcon} alt="Loader" />
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={sync.header} />
          </Typography>
          <div>
            <InputLabel mt={4} mr={2} mb={1} display={{ def: 'inline-block' }}>
              {sync.subheader} ({sync.dataArray.length})
            </InputLabel>
            <LeanBoxContainer>
              {sync.dataArray.map(data => (
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
          <Button variant="secondary">
            <LangDisplay text={sync.end} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </div>
  );
};
