import React, { createElement, FC, ReactNode } from 'react';
import styled, { useTheme } from 'styled-components';

import { SvgProps } from '../../assets';
import { Flex, NomineeMessage, Divider, Typography } from '../atoms';
import { utils, UtilsProps } from '../utils';

export type BackgroundType = 'gold' | 'silver' | 'default';

export interface DetailField {
  icon: FC<SvgProps>;
  label: string;
  value?: string;
  trailing?: ReactNode;
  isDanger?: boolean;
}

export interface DetailsCardProps extends UtilsProps {
  headerText: string;
  headerLeading?: ReactNode;
  headerTrailing?: ReactNode;
  headerOnly?: boolean;
  fields?: DetailField[];
  footer?: DetailField;
  text?: string;
  $backgroundType?: BackgroundType;
}

const backgroundMap: Record<BackgroundType, string> = {
  gold: 'goldenhint',
  silver: 'silverhint',
  default: 'separatorSecondary',
};

const StyledBackground = styled.div<Partial<DetailsCardProps>>`
  display: flex;
  flex-direction: column;
  background: ${({ theme, $backgroundType }) =>
    theme.palette.background[
      backgroundMap[$backgroundType ?? 'default'] ?? backgroundMap.default
    ]};
  border-radius: 8px;
  padding: 8px 8px;
  ${utils};
`;

interface FieldDisplayProps extends DetailField {
  $withBackground?: boolean;
}

const FieldDisplay: FC<FieldDisplayProps> = ({
  label,
  icon,
  value,
  isDanger,
  trailing,
  $withBackground,
}) => {
  const theme = useTheme();
  return (
    <NomineeMessage
      label={label}
      leading={createElement(icon, {
        height: 16,
        width: 24,
        fill: isDanger ? theme?.palette.text.error : undefined,
      })}
      value={value}
      variant={isDanger ? 'danger' : undefined}
      trailing={trailing}
      withBackground={$withBackground}
      $width="100%"
    />
  );
};

FieldDisplay.defaultProps = {
  value: undefined,
  trailing: undefined,
  isDanger: undefined,
  $withBackground: undefined,
};

export const DetailsCard: FC<DetailsCardProps> = ({
  headerLeading,
  headerText,
  headerTrailing,
  headerOnly,
  fields,
  footer,
  text,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <StyledBackground {...rest}>
      <NomineeMessage
        leading={headerLeading}
        label={headerText}
        isHeader
        trailing={headerTrailing}
        centerText={headerOnly}
      />
      {(fields || footer || text) && (
        <Flex direction="column" mb={2}>
          <Divider
            variant="horizontal"
            background={theme?.palette.background.separator}
            mt={1}
          />
          {fields && (
            <Flex direction="column" mt={3}>
              {fields.map(field => (
                <FieldDisplay {...field} key={field.label} />
              ))}
            </Flex>
          )}
          {footer && (
            <Flex mt={3}>
              <FieldDisplay {...footer} $withBackground />
            </Flex>
          )}
          {text && (
            <Typography
              color="muted"
              px={2}
              pt={4}
              pb={1}
              $whiteSpace="pre-wrap"
            >
              {text}
            </Typography>
          )}
        </Flex>
      )}
    </StyledBackground>
  );
};

DetailsCard.defaultProps = {
  headerLeading: undefined,
  headerTrailing: undefined,
  headerOnly: false,
  fields: undefined,
  footer: undefined,
  text: undefined,
  $backgroundType: undefined,
};
