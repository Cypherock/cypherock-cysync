import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

import { ArrowButton, Flex, Image, LangDisplay, Typography } from '../../atoms';
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

export interface GuidedFlowDialogBoxProps {
  title?: string;
  subtitle?: string;
  bulletList?: string[];
  messageBoxList?: Record<MessageBoxType, string>[];
  heading?: string;
  image: string;
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
export const GuidedFlowDialogBox: FC<GuidedFlowDialogBoxProps> = ({
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
      <DialogBoxBody p={0} gap={0}>
        <Flex
          gap={{ def: 12, lg: 32 }}
          align="center"
          justify="center"
          width="inherit"
          direction="column"
          pb={4}
        >
          <Image src={image} alt="device" />
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
              const type = Object.keys(messageBox)[0] as MessageBoxType;
              if (!type) return null;
              return (
                <MessageBox
                  key={`${type}-${index + 1}`}
                  text={messageBox[type]}
                  type={type}
                />
              );
            })}
          </Flex>
        )}
      </DialogBoxBody>
    </InnerContainer>
    <DialogBoxFooter py={{ def: 2, lg: 4 }} gap={10}>
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

GuidedFlowDialogBox.defaultProps = {
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
