import {
  Button,
  CheckBox,
  DialogBox,
  DialogBoxFooter,
  DialogBoxHeader,
  Flex,
  Input,
  LangDisplay,
  TextAreaInput,
  TextareaVector,
  Typography,
  Divider,
  Container,
  DeviceNotConnected,
  Close,
  Throbber,
  Dropdown,
  useTheme,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

interface DataItemType {
  id: string;
  text: string;
}

interface ContactSupportProps {
  header?: string;
  title?: string;
  subTitle?: string;
  btnCancel: string;
  btnSubmit: string;
  email?: string;
  category?: string;
  description?: string;
  label1?: string;
  label2?: string;
  handleApplicationCheckedItem: () => void;
  handleDeviceCheckedItem: () => void;
  isApplicationChecked: boolean;
  isDeviceChecked: boolean;
  error?: boolean;
  deviceNotConnected?: boolean;
  errorMsg?: string;
  connectionErrorMsg?: string;
  deviceErrorMsg?: string;
  deviceError?: boolean;
  confirmMsg?: string;
  logMsg?: string;
  globalError?: string;
  data: DataItemType[];
}

const CustomFlex = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  @media ${({ theme }) => theme.screensHeight.lg} {
    flex-direction: column;
  }
`;

export const ContactSupport: FC<ContactSupportProps> = ({
  header,
  title,
  subTitle,
  btnCancel,
  btnSubmit,
  email = '',
  category = '',
  description = '',
  label1 = '',
  label2 = '',
  handleApplicationCheckedItem,
  handleDeviceCheckedItem,
  isApplicationChecked,
  isDeviceChecked,
  error,
  deviceNotConnected,
  errorMsg = '',
  connectionErrorMsg = '',
  deviceErrorMsg = '',
  deviceError,
  confirmMsg = '',
  logMsg = '',
  globalError = '',
  data,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>('');
  const theme = useTheme();

  const handleChange = (id: string | undefined) => {
    setSelectedItem(id);
  };

  return (
    <DialogBox>
      <DialogBoxHeader>{header}</DialogBoxHeader>

      <Flex direction="column" gap={4} align="center" px={5} py={4}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h6" color="muted" align="center">
          {subTitle}
        </Typography>
      </Flex>

      <Flex direction="column" gap={16} px={5} py={4}>
        <CustomFlex>
          <Flex direction="column" gap={8}>
            <Typography
              $fontSize={14}
              $fontWeight="light"
              color="muted"
              px={1}
              $letterSpacing={0.1}
            >
              <LangDisplay text={email} />
            </Typography>
            <Input
              type="text"
              name="Email"
              placeholder="Your Email"
              $borderColor={error ? 'error' : undefined}
            />
          </Flex>

          <Flex direction="column" gap={8}>
            <Typography
              $fontSize={14}
              $fontWeight="light"
              color="muted"
              px={1}
              $letterSpacing={0.1}
            >
              <LangDisplay text={category} />
            </Typography>
            <Dropdown
              items={data}
              selectedItem={selectedItem}
              searchText="search Text"
              placeholderText="search text"
              onChange={handleChange}
              noLeftImageInList
            />
          </Flex>
        </CustomFlex>

        <Flex direction="column" gap={8} align="flex-start">
          <Typography
            $fontSize={14}
            $fontWeight="light"
            color="muted"
            px={1}
            $letterSpacing={0.1}
          >
            <LangDisplay text={description} />
          </Typography>
          <TextAreaInput
            placeholder="Describe your issue here"
            pr={1}
            pb={1}
            pl={3}
            mb={0}
            icon={<TextareaVector />}
          />
        </Flex>

        <Flex gap={16} align="center">
          <Flex align="flex-end">
            <CheckBox
              onChange={handleApplicationCheckedItem}
              checked={isApplicationChecked}
              size="big"
            />
          </Flex>
          <Typography color="muted">{label1}</Typography>
        </Flex>

        <Flex gap={16} align="center">
          <Flex align="flex-end">
            {(() => {
              if (isApplicationChecked && isDeviceChecked) {
                return (
                  <CheckBox
                    onChange={handleDeviceCheckedItem}
                    checked={isDeviceChecked}
                    size="big"
                    isDisabled={!isDeviceChecked}
                  />
                );
              }
              if (
                !(deviceNotConnected && deviceError) &&
                !isApplicationChecked
              ) {
                return (
                  <CheckBox
                    onChange={handleDeviceCheckedItem}
                    checked={isDeviceChecked}
                    size="big"
                    isDisabled={!isDeviceChecked}
                  />
                );
              }
              if (globalError) {
                return (
                  <CheckBox
                    onChange={handleDeviceCheckedItem}
                    checked={isDeviceChecked}
                    size="big"
                    isDisabled={!isDeviceChecked}
                  />
                );
              }
              return (
                <Throbber
                  size={15}
                  strokeWidth={2}
                  color={theme.palette.border.white}
                />
              );
            })()}
          </Flex>

          {(() => {
            if (isApplicationChecked && isDeviceChecked) {
              return (
                <Typography color="muted">
                  <LangDisplay text={logMsg} />
                </Typography>
              );
            }
            if (
              (!(deviceNotConnected && deviceError) && !isApplicationChecked) ||
              globalError
            ) {
              return (
                <Typography color="muted">
                  <LangDisplay text={label2} />
                </Typography>
              );
            }
            return (
              <Typography color="warn">
                <LangDisplay text={confirmMsg} />
              </Typography>
            );
          })()}
        </Flex>
        {(globalError || deviceNotConnected || deviceError) && (
          <Divider variant="horizontal" />
        )}
        {globalError ? (
          <Typography $fontWeight="light" color="error">
            {globalError}
          </Typography>
        ) : (
          (deviceNotConnected || deviceError) && (
            <Flex direction="column">
              <Container
                display="flex"
                direction="column"
                py={3}
                gap={10}
                align="flex-start"
              >
                <Flex gap={16}>
                  <Flex align="center">
                    {deviceNotConnected && <DeviceNotConnected />}
                    {deviceError && <Close />}
                  </Flex>
                  {deviceNotConnected && (
                    <Typography $fontWeight="light" color="muted">
                      {connectionErrorMsg}
                    </Typography>
                  )}
                  {deviceError && (
                    <Typography $fontWeight="light" color="muted">
                      {deviceErrorMsg}
                    </Typography>
                  )}
                </Flex>
                <Typography color="error">{errorMsg}</Typography>
              </Container>
            </Flex>
          )
        )}
      </Flex>

      <DialogBoxFooter>
        <Button variant="secondary">{btnCancel}</Button>
        <Button variant="primary">{btnSubmit}</Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

ContactSupport.defaultProps = {
  header: '',
  title: '',
  subTitle: '',
  email: '',
  category: '',
  description: '',
  label1: '',
  label2: '',
  error: true,
  deviceNotConnected: false,
  deviceError: false,
  errorMsg: '',
  connectionErrorMsg: '',
  deviceErrorMsg: '',
  confirmMsg: '',
  logMsg: '',
  globalError: '',
};
