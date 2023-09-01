import React from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';
import { useTheme } from 'styled-components';

export const JsonView: React.FC<ReactJsonViewProps> = (
  props: ReactJsonViewProps,
) => {
  const theme = useTheme();

  return (
    <ReactJson
      iconStyle="triangle"
      theme={{
        base00: theme?.palette.background.container,
        base01: theme?.palette.background.container,
        base02: theme?.palette.text.white,
        base03: theme?.palette.background.container,
        base04: theme?.palette.background.container,
        base05: theme?.palette.background.muted,
        base06: theme?.palette.background.muted,
        base07: theme?.palette.background.muted,
        base08: theme?.palette.background.muted,
        base09: theme?.palette.text.normal,
        base0A: theme?.palette.background.container,
        base0B: theme?.palette.text.normal,
        base0C: theme?.palette.background.muted,
        base0D: theme?.palette.text.white,
        base0E: theme?.palette.text.normal,
        base0F: theme?.palette.text.normal,
      }}
      {...props}
    />
  );
};
