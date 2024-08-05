import React, { FC } from 'react';
import styled from 'styled-components';

import { Flex, NomineeMessage, Divider } from '../atoms';
import { WidthProps, width } from '../utils';

export interface NomineeDetail {
  title: string;
  icon?: React.ReactNode;
  actionText?: string;
  value?: string;
  isEditable?: boolean;
  showEditBelow?: boolean;
  secondaryActionText?: string;
}

export interface NomineeSummaryMessageProps extends WidthProps {
  details?: NomineeDetail[];
  onAction?: () => void;
  showHeaderView?: boolean;
  showPersonDetails?: boolean;
  showMessageCard?: boolean;
  linearGradient?: string;
  customStyles?: React.CSSProperties;
}

const StyledNomineeMessage = styled.div<
  NomineeSummaryMessageProps & { customStyles?: React.CSSProperties }
>`
  display: flex;
  width: 624px;
  padding: 8px 16px;
  justify-content: space-between;
  align-items: center;
  background: ${({ linearGradient, theme }) =>
    linearGradient ?? theme.palette.background.separatorSecondary};
  border-radius: 8px;
  flex-direction: column;
  ${({ customStyles }) => customStyles && { ...customStyles }}

  ${width}
`;

export const Summary: FC<NomineeSummaryMessageProps> = ({
  details = [],
  onAction = undefined,
  showHeaderView = false,
  showPersonDetails = false,
  showMessageCard = false,
  linearGradient = '',
  customStyles,
  ...props
}) => (
  <Flex gap={8} direction="column" width="100%">
    {showHeaderView && details.length > 0 && (
      <NomineeMessage
        text={details[0]?.title}
        icon={details[0]?.icon}
        actionText={details[0]?.actionText}
        onAction={onAction}
        linearGradient={linearGradient}
        isEditable={details[0]?.isEditable}
        customStyles={customStyles}
        {...props}
      />
    )}
    {showPersonDetails && (
      <StyledNomineeMessage
        customStyles={{ display: 'flex', flexDirection: 'column' }}
        width="100%"
      >
        {details.map((detail, index) => (
          <React.Fragment key={detail.title ?? index}>
            <NomineeMessage
              text={detail.title}
              icon={detail.icon}
              value={detail.value}
              isEditable={details[0]?.isEditable}
              linearGradient={linearGradient}
              customStyles={customStyles}
              onAction={index === 0 ? onAction : undefined}
              actionText={index === 0 ? detail.actionText : undefined}
              showEditBelow={index !== 0 && detail.isEditable}
              secondaryActionText={detail.actionText ?? undefined}
              {...props}
            />
            {index === 0 && (
              <Divider variant="horizontal" background="#39322C" height="2px" />
            )}
          </React.Fragment>
        ))}
      </StyledNomineeMessage>
    )}

    {showMessageCard && details.length > 0 && (
      <StyledNomineeMessage
        customStyles={{ display: 'flex', flexDirection: 'column' }}
        width="100%"
      >
        <NomineeMessage
          text={details[0]?.title}
          value={details[0]?.value}
          actionText={details[0]?.actionText}
          isEditable={details[0]?.isEditable}
          onAction={onAction}
          linearGradient={linearGradient}
          customStyles={customStyles}
          showFullCard
          {...props}
        />
      </StyledNomineeMessage>
    )}
  </Flex>
);

Summary.defaultProps = {
  details: [],
  onAction: undefined,
  showHeaderView: false,
  showPersonDetails: false,
  showMessageCard: false,
  linearGradient: '',
  customStyles: {},
};
