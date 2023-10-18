import {
  Button,
  CheckBox,
  Clipboard,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  Typography,
  usbIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { constants } from '~/constants';
import {
  openSnackBar,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import logger from '~/utils/logger';

export interface PermissionSetupDialogProps {
  onComplete: () => void;
}

export const PermissionSetupDialog: React.FC<PermissionSetupDialogProps> = ({
  onComplete,
}) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    logger.info('On linux permission setup page');
  }, []);

  const handlePermissionScriptCopy = () => {
    dispatch(
      openSnackBar({
        icon: 'check',
        text: lang.strings.snackbar.copiedToClipboard,
      }),
    );
  };

  return (
    <Flex
      height="screen"
      width="screen"
      justify="center"
      align="center"
      $bgColor="contentGradient"
    >
      <DialogBox width={500}>
        <DialogBoxBody>
          <Image rotate={90} src={usbIcon} alt="Usb Icon" />
          <Container display="flex" direction="column" gap={4} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={lang.strings.permissionSetup.title} />
            </Typography>
            <Typography variant="h6" $textAlign="center" color="muted">
              <LangDisplay text={lang.strings.permissionSetup.subtext} />
            </Typography>

            <Container
              width="full"
              $borderRadius={8}
              $bgColor="input"
              align="center"
              py={1}
              px={2}
              mt={4}
              mb={4}
            >
              <Typography
                variant="h6"
                $textAlign="center"
                $userSelect="text"
                $fontWeight="light"
                $fontFamily="monospace"
                $fontSize={13}
                $wordBreak="break-word"
                color="warn"
                mr={2}
              >
                <LangDisplay text={constants.linuxPermissionScript} />
              </Typography>
              <Clipboard
                content={constants.linuxPermissionScript}
                variant="gold"
                onCopy={handlePermissionScriptCopy}
              />
            </Container>

            <CheckBox
              flexProps={{ align: 'stretch' }}
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              id="permission_setup_checkbox"
              label={lang.strings.permissionSetup.checkbox}
            />
          </Container>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant={isChecked ? 'primary' : 'secondary'}
            onClick={onComplete}
            disabled={!isChecked}
          >
            <LangDisplay text={lang.strings.buttons.continue} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </Flex>
  );
};
