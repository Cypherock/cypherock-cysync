import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

import {
  ArrowButton,
  Flex,
  LangDisplay,
  Typography,
  TypographyColor,
} from '@cypherock/cysync-ui/src/components/atoms';
import { BulletList } from '@cypherock/cysync-ui/src/components/molecules/BulletList';
import { GoldenArrowList } from '@cypherock/cysync-ui/src/components/molecules/GoldenArrowList';
import {
  MessageBox,
  MessageBoxType,
} from '@cypherock/cysync-ui/src/components/molecules/MessageBox';

import {
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
} from '@cypherock/cysync-ui/src/components/molecules/Dialog';

const InnerContainer = styled.div`
  max-height: 58vh;
  overflow-y: auto;
`;

export interface WalletTransferLostCardsFlowDialogBoxProps {
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
  onPrevious: React.MouseEventHandler<HTMLButtonElement>;
}
export const WalletTransferLostCardsFlowDialogBox: FC<
  WalletTransferLostCardsFlowDialogBoxProps
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
  onPrevious,
  disablePrev,
  disableNext,
}) => (
  <>
    {heading && (
      <DialogBoxHeader p={2}>
        <Typography variant="h6" color="muted">
          <LangDisplay text={heading} />
        </Typography>
      </DialogBoxHeader>
    )}
    <InnerContainer>
      <DialogBoxBody gap={0}>
        <Flex
          gap={{ def: 12, lg: 32 }}
          align="center"
          justify="center"
          width="inherit"
          direction="column"
          pb={2}
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
          <Flex direction="column" gap={8} pt={2} pb={2} width="full">
            <GoldenArrowList items={goldenArrowList} />
          </Flex>
        )}
        {bulletList && (
          <Flex direction="column" gap={8} pt={2} pb={2} width="full">
            <BulletList items={bulletList} />
          </Flex>
        )}
        {messageBoxList && (
          <Flex direction="column" gap={8} pt={2} pb={2} width="full">
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
  </>
);

WalletTransferLostCardsFlowDialogBox.defaultProps = {
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
};
