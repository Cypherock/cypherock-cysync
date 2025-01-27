import { colors } from './color.styled';
import { spacing } from './layout.styled';
import { shadows } from './shadow.styled';
import { fontFamily, fontWeight, typography } from './typography.styled';

export type ThemeType = typeof theme;

export const theme = {
  palette: {
    ...colors,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontSize: { ...typography.body, ...typography.heading },
    fontWeight: { ...fontWeight },
    shared: {
      fontFamily: fontFamily.poppins,
    },
    heading: {
      shared: {
        fontWeight: fontWeight.medium,
      },
      display: {
        fontSize: typography.heading.display1,
      },
      h1: {
        fontSize: typography.heading.h1,
      },
      h2: {
        fontSize: typography.heading.h2,
      },
      h3: {
        fontSize: typography.heading.h3,
      },
      h4: {
        fontSize: typography.heading.h4,
      },
      h5: {
        fontSize: typography.heading.h5,
      },
      h6: {
        fontSize: typography.heading.h6,
      },
    },
    body: {
      shared: {
        fontWeight: fontWeight.regular,
      },
      para: {
        fontSize: typography.body.lg,
      },
      body: {
        fontSize: typography.body.base,
      },
      label: {
        fontSize: typography.body.sm,
      },
      tag: {
        fontSize: typography.body.xs,
      },
    },
  },
  spacing: {
    one: {
      spacing: spacing.one,
    },
    two: {
      spacing: spacing.two,
    },
    three: {
      spacing: spacing.three,
    },
  },
  shadow: {
    popup: shadows.popup,
  },
};
