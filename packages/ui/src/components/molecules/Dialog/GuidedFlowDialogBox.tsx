import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

import { ArrowButton, Flex, Image, LangDisplay, Typography } from '../../atoms';
import { BulletList } from '../BulletList';
import { GoldenArrowList } from '../GoldenArrowList';
import { Info } from '../Info';

import { DialogBoxBody, DialogBoxFooter, DialogBoxHeader } from '.';

const InnerContainer = styled.div`
  max-height: 58vh;
  overflow-y: auto;
`;

export const GuidedFlowDialogBox: FC<{
  heading?: string;
  title?: string;
  image: string;
  children?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  subTitle?: string;
  footer?: ReactNode;
  goldenArrowList?: any[];
  bulletList?: any[];
  infoText?: string;
  infoTextVariant?: 'warn' | 'muted' | 'white';
  infoIconVariant?: 'white' | 'yellow';
  showInfoIcon?: boolean;
  disableLeftArrowButton?: boolean;
  disableRightArrowButton?: boolean;
  onNext: React.MouseEventHandler<HTMLButtonElement>;
  onPrevious: React.MouseEventHandler<HTMLButtonElement>;
}> = ({
  heading,
  image,
  title,
  children,
  isLoading,
  loadingText,
  subTitle,
  footer,
  goldenArrowList,
  bulletList,
  infoIconVariant,
  infoTextVariant,
  infoText,
  showInfoIcon,
  onNext,
  onPrevious,
  disableLeftArrowButton,
  disableRightArrowButton,
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
      <DialogBoxBody
        gap={{
          def: 12,
          lg: 48,
        }}
        p="0"
      >
        <Flex
          gap={{ def: 12, lg: 32 }}
          align="center"
          justify="center"
          width="inherit"
          direction="column"
        >
          <Image src={image} alt="device" />
          <Flex direction="column" align="center" gap={4}>
            {title && (
              <Typography px={5} $textAlign="center" variant="h5">
                <LangDisplay text={title} />
              </Typography>
            )}
            {subTitle && (
              <Typography px={5} $textAlign="center" color="muted">
                <LangDisplay text={subTitle} />
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
        {(goldenArrowList || bulletList || infoText) && (
          <Flex direction="column" gap={{ def: 24, lg: 48 }} px={5}>
            {goldenArrowList && <GoldenArrowList items={goldenArrowList} />}
            {bulletList && <BulletList items={bulletList} />}
            {infoText && (
              <Info
                showIcon={showInfoIcon ?? true}
                iconVariant={infoIconVariant ?? 'white'}
                textVariant={infoTextVariant ?? 'muted'}
                text={infoText}
              />
            )}
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
            variant={disableLeftArrowButton ? 'disabled' : 'enabled'}
          />
          <ArrowButton
            direction="right"
            onClick={onNext}
            variant={disableRightArrowButton ? 'disabled' : 'enabled'}
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
  subTitle: undefined,
  title: undefined,
  footer: undefined,
  heading: undefined,
  goldenArrowList: undefined,
  bulletList: undefined,
  infoIconVariant: undefined,
  infoTextVariant: undefined,
  infoText: undefined,
  showInfoIcon: true,
  disableLeftArrowButton: false,
  disableRightArrowButton: false,
};
