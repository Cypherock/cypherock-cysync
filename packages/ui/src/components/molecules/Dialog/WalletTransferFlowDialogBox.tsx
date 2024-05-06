import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

import {
  ArrowButton,
  Button,
  Flex,
  LangDisplay,
  Typography,
  TypographyColor,
} from '../../atoms';
import { BulletList } from '../BulletList';
import { GoldenArrowList } from '../GoldenArrowList';
import { MessageBox, MessageBoxType } from '../MessageBox';

import { DialogBoxBody, DialogBoxFooter, DialogBoxHeader } from '.';

const InnerContainer = styled.div`
  padding-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  max-height: 58vh;
  overflow-y: auto;
`;

const DialogContainer = styled.div`
  flex: 1;
  &:not(:last-child) {
    margin-right: 20px;
  }
  width: 500px;
`;

export interface WalletTransferFlowDialogBoxProps {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<string, string>[];
  heading?: string;
  image: React.ReactElement;
  children?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  footer?: ReactNode;
  goldenArrowList?: any[];
  disablePrev?: boolean;
  disableNext?: boolean;
  onNext: React.MouseEventHandler<HTMLButtonElement>;
  onSelect?: any;
  changeCondition: any;
  onPrevious: React.MouseEventHandler<HTMLButtonElement>;
  lang: any;
}
export const WalletTransferFlowDialogBox: FC<
  WalletTransferFlowDialogBoxProps
> = ({
  heading,
  image,
  title,
  children,
  isLoading,
  loadingText,
  subtitle,
  footer,
  goldenArrowList,
  bulletList,
  messageBoxList,
  onNext,
  onSelect,
  changeCondition,
  onPrevious,
  disablePrev,
  disableNext,
  lang,
}) => {
  const shouldRenderDoubleDialog =
    // this is not hardcoded this is for check true or false
    title !== undefined &&
    [
      'I have lost my X1 vault but I still have all of the 4 old X1 cards',
      'I have lost my X1 vault and have less than 4 old X1 cards',
    ].includes(title);

  const dialogTexts = {
    dialog1:
      lang.strings.settings.tabs.device.item.transferWalletSettings.case1.title,
    message1:
      lang.strings.settings.tabs.device.item.transferWalletSettings.case1
        .message,
    dialog2:
      lang.strings.settings.tabs.device.item.transferWalletSettings.case2.title,
    message2:
      lang.strings.settings.tabs.device.item.transferWalletSettings.case2
        .message,
  };

  console.log(lang);

  const DialogBoxStyle = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    /* overflow-y: scroll; */
    background-image: ${({ theme }) => theme.palette.background.primary};
    box-shadow: ${({ theme }) => theme.shadow.popup};
    border-color: ${({ theme }) => theme.palette.border.popup};
    text-align: center;
  `;

  return (
    <>
      {heading && (
        <DialogBoxHeader p={2}>
          <Typography variant="h6" color="muted">
            <LangDisplay text={heading} />
          </Typography>
        </DialogBoxHeader>
      )}
      {shouldRenderDoubleDialog ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <InnerContainer>
            {/* Dialog 1: "I have lost my X1 vault but I still have all of the 4 old X1 cards" */}
            <DialogBoxStyle>
              <DialogContainer>
                <DialogBoxBody p={0} gap={0}>
                  <Flex
                    gap={{ def: 12, lg: 32 }}
                    align="center"
                    justify="center"
                    width="inherit"
                    direction="column"
                    pb={4}
                  >
                    {image}
                    <Flex
                      direction="column"
                      align="center"
                      gap={4}
                      pl={4}
                      pr={4}
                    >
                      <Typography $textAlign="center" variant="h5">
                        <LangDisplay text={dialogTexts.dialog1} />
                      </Typography>
                      {isLoading && loadingText && (
                        <Typography color="muted">
                          <LangDisplay text={loadingText} />
                        </Typography>
                      )}
                    </Flex>
                  </Flex>
                  <Flex
                    direction="column"
                    gap={8}
                    pt={2}
                    pb={4}
                    width="full"
                    pl={4}
                    pr={4}
                  >
                    <div style={{ height: '95px' }}>
                      <MessageBox
                        key="info-1"
                        text={dialogTexts.message1}
                        textColor="muted"
                        type="info"
                      />
                    </div>
                  </Flex>
                </DialogBoxBody>
                <DialogBoxFooter py={{ def: 2, lg: 4 }} gap={10}>
                  {footer}
                  {!footer && <Button onClick={onSelect}>Select</Button>}
                </DialogBoxFooter>
              </DialogContainer>
            </DialogBoxStyle>
          </InnerContainer>
          <InnerContainer>
            {/* Dialog 2: "I have lost my X1 vault and have less than 4 old X1 cards" */}
            <DialogBoxStyle>
              <DialogContainer>
                <DialogBoxBody p={0} gap={0}>
                  <Flex
                    gap={{ def: 12, lg: 32 }}
                    align="center"
                    justify="center"
                    width="inherit"
                    direction="column"
                    pb={4}
                  >
                    {image}
                    <Flex
                      direction="column"
                      align="center"
                      gap={4}
                      pl={4}
                      pr={4}
                    >
                      <Typography $textAlign="center" variant="h5">
                        <LangDisplay text={dialogTexts.dialog2} />
                      </Typography>
                      {isLoading && loadingText && (
                        <Typography color="muted">
                          <LangDisplay text={loadingText} />
                        </Typography>
                      )}
                    </Flex>
                  </Flex>
                  <Flex
                    direction="column"
                    gap={8}
                    pt={2}
                    pb={4}
                    width="full"
                    pl={4}
                    pr={4}
                  >
                    <MessageBox
                      key="info-2"
                      text={dialogTexts.message2}
                      textColor="muted"
                      type="info"
                    />
                  </Flex>
                </DialogBoxBody>
                <DialogBoxFooter py={{ def: 2, lg: 4 }} gap={10}>
                  {footer}
                  {!footer && <Button onClick={changeCondition}>Select</Button>}
                </DialogBoxFooter>
              </DialogContainer>
            </DialogBoxStyle>
          </InnerContainer>
        </div>
      ) : (
        <InnerContainer>
          <DialogBoxBody p={0} gap={0}>
            <Flex
              gap={{ def: 12, lg: 32 }}
              align="center"
              justify="center"
              width="inherit"
              direction="column"
              pb={4}
            >
              {image}
              <Flex direction="column" align="center" gap={4}>
                {title && (
                  <Typography $textAlign="center" variant="h5">
                    <LangDisplay text={title} />
                  </Typography>
                )}
                {subtitle && (
                  <Typography $textAlign="center" color="muted">
                    <LangDisplay text={subtitle} />
                  </Typography>
                )}
                {isLoading && loadingText && (
                  <Typography color="muted">
                    <LangDisplay text={loadingText} />
                  </Typography>
                )}
                {children}
              </Flex>
            </Flex>
            {goldenArrowList && (
              <Flex direction="column" gap={8} pt={2} pb={4} width="full">
                <GoldenArrowList items={goldenArrowList} />
              </Flex>
            )}
            {bulletList && (
              <Flex direction="column" gap={8} pt={2} pb={4} width="full">
                <BulletList items={bulletList} />
              </Flex>
            )}
            {messageBoxList && (
              <Flex direction="column" gap={8} pt={2} pb={4} width="full">
                {messageBoxList.map((messageBox, index) => {
                  const key = Object.keys(messageBox)[0];
                  const args = key.split('-');

                  const type = args[0] as MessageBoxType;
                  if (!type) return null;

                  let textColor: TypographyColor | undefined;
                  if (args.length > 1) textColor = args[1] as TypographyColor;

                  return (
                    <MessageBox
                      key={`${type}-${index + 1}`}
                      text={messageBox[key]}
                      textColor={textColor}
                      type={type}
                    />
                  );
                })}
              </Flex>
            )}
          </DialogBoxBody>
        </InnerContainer>
      )}
      {shouldRenderDoubleDialog ? (
        ''
      ) : (
        <DialogBoxFooter py={{ def: 2, lg: 4 }} gap={16}>
          {footer}
          {!footer && (
            <>
              <ArrowButton
                direction="left"
                onClick={onPrevious}
                variant={disablePrev ? 'disabled' : 'enabled'}
              />
              <ArrowButton
                direction="right"
                onClick={onNext}
                variant={disableNext ? 'disabled' : 'enabled'}
              />
            </>
          )}
        </DialogBoxFooter>
      )}
    </>
  );
};

WalletTransferFlowDialogBox.defaultProps = {
  children: undefined,
  isLoading: false,
  loadingText: undefined,
  subtitle: undefined,
  title: undefined,
  footer: undefined,
  heading: undefined,
  goldenArrowList: undefined,
  bulletList: undefined,
  messageBoxList: undefined,
  disablePrev: false,
  disableNext: false,
  onSelect: undefined,
};
