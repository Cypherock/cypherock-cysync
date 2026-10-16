import { BigNumber } from '@cypherock/cysync-utils';
import { ArrowRightIcon, Button, Flex, Typography } from '@cypherock/cysync-ui';
import React from 'react';

export type WithStyle<T> = T & { style?: React.CSSProperties };
export const F = Flex as React.ComponentType<
  WithStyle<React.ComponentProps<typeof Flex>>
>;
export const T = Typography as React.ComponentType<
  WithStyle<React.ComponentProps<typeof Typography>>
>;

export const DIVIDER_STYLE: React.CSSProperties = {
  borderTop: '0.5px solid rgba(68,56,48,0.5)',
};

export const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Poppins',
  fontSize: 12,
  fontWeight: 500,
  color: '#8B8682',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: 16,
  display: 'block',
};

const iconBg = (disabled?: boolean): React.CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  background: disabled ? 'rgba(68,56,48,0.25)' : 'rgba(196,146,42,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const parseAmount = (value: string, abbr: string): string => {
  if (!value || value === '0') return `0 ${abbr}`;
  try {
    const trimmed = parseFloat(
      new BigNumber(value).toFixed(6, BigNumber.ROUND_FLOOR),
    ).toString();
    return `${trimmed} ${abbr}`;
  } catch {
    return `0 ${abbr}`;
  }
};

// Metric card

export const MetricCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  green?: boolean;
  icon: React.ReactNode;
}> = ({ label, value, sub, green, icon }) => (
  <F
    direction="column"
    gap={10}
    style={{
      background: '#1A1612',
      border: '1px solid rgba(68,56,48,0.6)',
      borderRadius: 12,
      padding: '16px 18px',
      flex: 1,
    }}
  >
    <Flex align="center" gap={7}>
      {icon}
      <T
        variant="span"
        color="muted"
        style={{ fontSize: 13, fontFamily: 'Poppins' }}
      >
        {label}
      </T>
    </Flex>
    <T
      variant="span"
      style={{
        fontSize: 20,
        fontWeight: 500,
        color: green ? '#4CAF7D' : '#FFFFFF',
        fontFamily: 'Poppins',
        lineHeight: 1.2,
      }}
    >
      {value}
    </T>
    {sub && (
      <T
        variant="span"
        style={{ fontSize: 12, color: '#5C5855', fontFamily: 'Poppins' }}
      >
        {sub}
      </T>
    )}
  </F>
);

MetricCard.defaultProps = { sub: undefined, green: false };

// Action card

export const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  disabled?: boolean;
  primary?: boolean;
  onClick?: () => void;
}> = ({
  icon,
  title,
  description,
  buttonLabel,
  disabled,
  primary,
  onClick,
}) => (
  <F
    direction="column"
    gap={12}
    style={{
      background: '#1A1612',
      border: `1px solid ${
        disabled ? 'rgba(68,56,48,0.3)' : 'rgba(68,56,48,0.6)'
      }`,
      borderRadius: 14,
      padding: '20px 22px',
      flex: 1,
      minWidth: 220,
      opacity: disabled ? 0.45 : 1,
    }}
  >
    <Flex align="center" gap={12}>
      <div style={iconBg(disabled)}>{icon}</div>
      <T
        variant="span"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: '#FFFFFF',
          fontFamily: 'Poppins',
        }}
      >
        {title}
      </T>
    </Flex>
    <T
      variant="span"
      style={{
        fontSize: 14,
        color: '#8B8682',
        lineHeight: 1.65,
        fontFamily: 'Poppins',
        flex: 1,
      }}
    >
      {description}
    </T>
    <Button
      variant={primary ? 'primary' : 'secondary'}
      disabled={disabled}
      onClick={onClick}
      style={{ alignSelf: 'flex-start', marginTop: 4 }}
    >
      {buttonLabel}
    </Button>
  </F>
);

ActionCard.defaultProps = {
  disabled: false,
  primary: false,
  onClick: undefined,
};

// Flow diagram

export interface FlowNode {
  label: string;
  icon: React.ReactNode;
  dashed?: boolean;
}

export const FlowDiagram: React.FC<{
  title: string;
  nodes: FlowNode[];
  caption?: string;
}> = ({ title, nodes, caption }) => (
  <Flex direction="column" gap={10}>
    <T
      variant="span"
      style={{
        fontFamily: 'Poppins',
        fontSize: 13,
        fontWeight: 500,
        color: '#8B8682',
      }}
    >
      {title}
    </T>
    <Flex align="center" gap={6} $flexWrap="wrap">
      {nodes.map((node, i) => (
        <React.Fragment key={node.label}>
          <F
            align="center"
            gap={7}
            style={{
              background: '#1A1612',
              border: `1px ${node.dashed ? 'dashed' : 'solid'} rgba(68,56,48,${
                node.dashed ? '0.5' : '0.7'
              })`,
              borderRadius: 8,
              padding: '7px 13px',
              opacity: node.dashed ? 0.7 : 1,
            }}
          >
            {node.icon}
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 14,
                color: node.dashed ? '#8B8682' : '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </T>
          </F>
          {i < nodes.length - 1 && <ArrowRightIcon width={10} height={10} />}
        </React.Fragment>
      ))}
    </Flex>
    {caption && (
      <T
        variant="span"
        style={{ fontFamily: 'Poppins', fontSize: 12, color: '#5C5855' }}
      >
        {caption}
      </T>
    )}
  </Flex>
);

FlowDiagram.defaultProps = { caption: undefined };

// Info strip

export const InfoStrip: React.FC<{
  items: { icon: React.ReactNode; title: string; body: string }[];
}> = ({ items }) => (
  <F
    align="stretch"
    style={{
      background: '#1A1612',
      border: '1px solid rgba(68,56,48,0.6)',
      borderRadius: 12,
    }}
  >
    {items.map((item, i) => (
      <React.Fragment key={item.title}>
        <F
          align="flex-start"
          gap={12}
          style={{ flex: 1, padding: '16px 20px' }}
        >
          <div style={{ marginTop: 1, flexShrink: 0 }}>{item.icon}</div>
          <Flex direction="column" gap={4}>
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: 500,
                color: '#FFFFFF',
              }}
            >
              {item.title}
            </T>
            <T
              variant="span"
              style={{
                fontFamily: 'Poppins',
                fontSize: 13,
                color: '#8B8682',
                lineHeight: 1.6,
              }}
            >
              {item.body}
            </T>
          </Flex>
        </F>
        {i < items.length - 1 && (
          <div
            style={{
              width: '0.5px',
              background: 'rgba(68,56,48,0.5)',
              flexShrink: 0,
            }}
          />
        )}
      </React.Fragment>
    ))}
  </F>
);
