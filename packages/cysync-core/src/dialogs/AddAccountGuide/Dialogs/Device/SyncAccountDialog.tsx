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
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '~/store';

import { useAddAccountGuide } from '../../context';

export const SyncAccountDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const sync = lang.addAccount.syncAccount.info.dialogBox;
  const { onNext } = useAddAccountGuide();

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newTimeoutId = setTimeout(() => {
      onNext(1, 4); // Pass the parameter to onNext
    }, 3000);

    setTimeoutId(newTimeoutId);

    return () => {
      // Clear the timeout when the component unmounts or onNext is called
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array to simulate component mount effect

  const handleNextWithTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    onNext(); // Pass the parameter to onNext
  };

  return (
    <div>
      <DialogBox width={500} height={544}>
        <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            <LangDisplay text={sync.title} />
          </Typography>
        </DialogBoxHeader>
        <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
          <Image src={loaderGrayIcon} alt="Loader" animate="spin" />
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
          <Button variant="secondary" onClick={handleNextWithTimeout}>
            <LangDisplay text={sync.end} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </div>
  );
};
