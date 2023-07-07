import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  Image,
  errorIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useAppSelector, selectLanguage } from '~/store';
import { getResetCySyncMethod } from '~/utils/reset';

export interface ForgotPasswordDialogProps {
  onCancel: () => void;
}

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  onCancel,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [isLoading, setIsLoading] = React.useState(false);

  const onReset = async () => {
    setIsLoading(true);
    await getResetCySyncMethod()();
    setIsLoading(false);
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={errorIcon} alt="Error" />
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay
              text={lang.strings.lockscreen.forgotPasswordDialog.title}
            />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay
              text={lang.strings.lockscreen.forgotPasswordDialog.subtext}
            />
          </Typography>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          <LangDisplay text={lang.strings.buttons.cancel} />
        </Button>

        <Button variant="primary" onClick={onReset} isLoading={isLoading}>
          <LangDisplay text={lang.strings.buttons.reset} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
