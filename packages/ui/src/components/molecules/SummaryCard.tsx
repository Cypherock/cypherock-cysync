import React, { FC } from 'react';
import styled, { useTheme } from 'styled-components';

import { EditButton } from './Prefabs';

import {
  ClockIcon,
  EmailIcon,
  EncryptedMessageIcon,
  MessageIcon,
  SvgProps,
  UserIcon,
  WalletIcon,
} from '../../assets';
import { Flex, NomineeMessage, Divider, Typography } from '../atoms';
import { svgGradients } from '../GlobalStyles';

const iconMap: Record<string, React.FC<SvgProps>> = {
  wallet: WalletIcon,
  clock: ClockIcon,
  user: UserIcon,
  email: EmailIcon,
  message: MessageIcon,
  encrypted: EncryptedMessageIcon,
};

export type IconType = keyof typeof iconMap;
export type BackgroundType = 'gold' | 'silver' | 'default';

export interface SummaryField {
  icon: IconType;
  label: string;
  value?: string;
  onEdit?: () => void;
  isDanger?: boolean;
}

export interface SummaryCardProps {
  headerText: string;
  headerIcon?: IconType;
  onHeaderEdit?: () => void;
  fields?: SummaryField[];
  footer?: SummaryField;
  text?: string;
  backgroundType?: BackgroundType;
}

const backgroundMap: Record<BackgroundType, string> = {
  gold: 'goldenhint',
  silver: 'silverhint',
  default: 'separatorSecondary',
};

const StyledBackground = styled.div<{ backgroundType?: BackgroundType }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme, backgroundType }) =>
    theme.palette.background[backgroundMap[backgroundType ?? 'default']]};
  border-radius: 8px;
  padding: 8px 8px;
`;

interface FieldDisplayProps extends SummaryField {
  withBackground?: boolean;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({
  label,
  icon,
  value,
  isDanger,
  onEdit,
  withBackground,
}) => {
  const theme = useTheme();
  return (
    <NomineeMessage
      label={label}
      leading={React.createElement(iconMap[icon], {
        width: 16,
        height: 16,
        fill: isDanger ? theme?.palette.text.error : undefined,
      })}
      value={value}
      variant={isDanger ? 'danger' : undefined}
      trailing={onEdit ? <EditButton onClick={onEdit} /> : undefined}
      withBackground={withBackground}
    />
  );
};

FieldDisplay.defaultProps = {
  value: undefined,
  onEdit: undefined,
  isDanger: undefined,
  withBackground: undefined,
};

export const SummaryCard: FC<SummaryCardProps> = ({
  headerIcon,
  headerText,
  onHeaderEdit,
  fields,
  footer,
  text,
  backgroundType,
}) => {
  const theme = useTheme();

  return (
    <StyledBackground backgroundType={backgroundType}>
      <NomineeMessage
        leading={
          !!headerIcon &&
          React.createElement(iconMap[headerIcon], {
            fill: `url(#${svgGradients.gold})`,
          })
        }
        label={headerText}
        withHeaderFont
        trailing={!!onHeaderEdit && <EditButton onClick={onHeaderEdit} />}
      />
      {(fields || footer || text) && (
        <Divider
          variant="horizontal"
          background={theme?.palette.background.separator}
          mt={1}
        />
      )}
      {fields && (
        <Flex direction="column" mt={3}>
          {fields.map(field => (
            <FieldDisplay {...field} key={field.label} />
          ))}
        </Flex>
      )}
      {footer && (
        <Flex mt={3}>
          <FieldDisplay {...footer} withBackground />
        </Flex>
      )}
      {text && (
        <Typography $maxWidth="640px" color="muted" px={2} pt={4} pb={1}>
          {text}
        </Typography>
      )}
      {(fields || footer || text) && <Flex mt={2} />}
    </StyledBackground>
  );
};

SummaryCard.defaultProps = {
  headerIcon: undefined,
  onHeaderEdit: undefined,
  fields: undefined,
  footer: undefined,
  text: undefined,
  backgroundType: undefined,
};
