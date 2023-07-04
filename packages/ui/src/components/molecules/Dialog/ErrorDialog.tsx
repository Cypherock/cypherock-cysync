import React, { Dispatch, ReactNode, SetStateAction } from 'react';

import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';

import {
  DeviceUpdateFailedIcon,
  FailIcon,
  SettingsWrongIcon,
  walletErrorIcon,
} from '../../../assets';
import {
  Button,
  CheckBox,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '../../atoms';
import { Dropdown, DropdownItems } from '../Dropdown';

type IconType = 'device' | 'misconfigured' | 'default' | 'walletSync';

export interface ErrorDialogProps {
  title: string;
  subtext?: string;
  showRetry?: boolean;
  showReport?: boolean;
  showKeepAll?: boolean;
  showDelete?: boolean;
  onRetry?: () => void;
  iconType?: IconType;
  checkBoxText?: string;
  isChecked?: boolean;
  dropdownItems?: DropdownItems;
  setSelectedDropdownItems?: Dispatch<SetStateAction<DropdownItems>>;
  checkBoxHandler?: () => void;
}

const iconMap: Record<IconType, ReactNode> = {
  default: <FailIcon />,
  device: <DeviceUpdateFailedIcon />,
  misconfigured: <SettingsWrongIcon />,
  walletSync: <Image src={walletErrorIcon} alt="walletSync" />,
};
export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  title,
  subtext,
  showRetry,
  showReport,
  showKeepAll,
  showDelete,
  onRetry,
  iconType,
  checkBoxHandler,
  checkBoxText,
  dropdownItems,
  isChecked,
  setSelectedDropdownItems,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody
      gap={{
        def: 12,
        lg: 48,
      }}
      p="0"
      py={4}
    >
      <Flex
        gap={{ def: 12, lg: 32 }}
        align="center"
        justify="center"
        width="inherit"
        direction="column"
      >
        {iconMap[iconType ?? 'default']}
        <Flex direction="column" align="center" gap={4} px={5}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={title} />
          </Typography>
          {subtext && (
            <Typography variant="h6" $textAlign="center" color="muted">
              <LangDisplay text={subtext} />
            </Typography>
          )}
        </Flex>
      </Flex>
      {(checkBoxText || dropdownItems) && (
        <Flex width="full" direction="column" gap={{ def: 24, lg: 48 }} px={5}>
          {dropdownItems && setSelectedDropdownItems && (
            <Dropdown
              items={dropdownItems}
              setSelectedItems={setSelectedDropdownItems}
            />
          )}
          {checkBoxText && checkBoxHandler && (
            <Flex align="center" justify="center" width="full">
              <CheckBox
                checked={isChecked ?? false}
                onChange={checkBoxHandler}
                id="wallet_checkbox"
                label={checkBoxText}
              />
            </Flex>
          )}
        </Flex>
      )}
    </DialogBoxBody>
    <DialogBoxFooter>
      {showReport && (
        <Button variant="primary" disabled>
          Report
        </Button>
      )}
      {showRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
      {showKeepAll && <Button variant="secondary">Keep it all</Button>}
      {showDelete && <Button variant="primary">Delete</Button>}
    </DialogBoxFooter>
  </DialogBox>
);

ErrorDialog.defaultProps = {
  subtext: undefined,
  showRetry: false,
  showReport: false,
  onRetry: undefined,
  iconType: 'default',
  showDelete: undefined,
  showKeepAll: undefined,
  checkBoxHandler: undefined,
  checkBoxText: undefined,
  dropdownItems: undefined,
  isChecked: undefined,
  setSelectedDropdownItems: undefined,
};
