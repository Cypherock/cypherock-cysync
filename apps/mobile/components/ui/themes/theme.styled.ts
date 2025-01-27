import { colors } from './color.styled';
import { spacing } from './layout.styled';
import { shadows } from './shadow.styled';
import {
  fontFamily,
  fontWeight,
  fontSize,
  fontSizeLarge,
  lineHeights,
  lineHeightsLarge,
} from './typography.styled';

export type ThemeType = typeof theme;

export const theme = {
  palette: {
    ...colors,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontSize: {
      ...fontSize.body,
      ...fontSize.heading,
    },
    fontWeight: { ...fontWeight },
    shared: {
      fontFamily: fontFamily.poppins,
    },
    heading: {
      shared: {
        fontWeight: fontWeight.medium,
      },
      display: {
        fontSize: fontSize.heading.display1,
        lineHeight: lineHeights.heading.display1,
      },
      h1: {
        fontSize: fontSize.heading.h1,
        lineHeight: lineHeights.heading.h1,
      },
      h2: {
        fontSize: fontSize.heading.h2,
        lineHeight: lineHeights.heading.h2,
      },
      h3: {
        fontSize: fontSize.heading.h3,
        lineHeight: lineHeights.heading.h3,
      },
      h4: {
        fontSize: fontSize.heading.h4,
        lineHeight: lineHeights.heading.h4,
      },
      h5: {
        fontSize: fontSize.heading.h5,
        lineHeight: lineHeights.heading.h5,
      },
      h6: {
        fontSize: fontSize.heading.h6,
        lineHeight: lineHeights.heading.h6,
      },
    },
    body: {
      shared: {
        fontWeight: fontWeight.regular,
      },
      para: {
        fontSize: fontSize.body.lg,
        lineHeight: lineHeights.body.lg,
      },
      body: {
        fontSize: fontSize.body.base,
        lineHeight: lineHeights.body.base,
      },
      label: {
        fontSize: fontSize.body.sm,
        lineHeight: lineHeights.body.sm,
      },
      tag: {
        fontSize: fontSize.body.xs,
        lineHeight: lineHeights.body.xs,
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

export const largeTheme = {
  ...theme,
  typography: {
    ...theme.typography,
    fontSize: {
      ...fontSizeLarge.body,
      ...fontSizeLarge.heading,
    },
    heading: {
      ...theme.typography.heading,
      display: {
        fontSize: fontSizeLarge.heading.display1,
        lineHeight: lineHeightsLarge.heading.display1,
      },
      h1: {
        fontSize: fontSizeLarge.heading.h1,
        lineHeight: lineHeightsLarge.heading.h1,
      },
      h2: {
        fontSize: fontSizeLarge.heading.h2,
        lineHeight: lineHeightsLarge.heading.h2,
      },
      h3: {
        fontSize: fontSizeLarge.heading.h3,
        lineHeight: lineHeightsLarge.heading.h3,
      },
      h4: {
        fontSize: fontSizeLarge.heading.h4,
        lineHeight: lineHeightsLarge.heading.h4,
      },
      h5: {
        fontSize: fontSizeLarge.heading.h5,
        lineHeight: lineHeightsLarge.heading.h5,
      },
      h6: {
        fontSize: fontSizeLarge.heading.h6,
        lineHeight: lineHeightsLarge.heading.h6,
      },
    },
    body: {
      shared: {
        fontWeight: fontWeight.regular,
      },
      para: {
        fontSize: fontSizeLarge.body.lg,
        lineHeight: lineHeightsLarge.body.lg,
      },
      body: {
        fontSize: fontSizeLarge.body.base,
        lineHeight: lineHeightsLarge.body.base,
      },
      label: {
        fontSize: fontSizeLarge.body.sm,
        lineHeight: lineHeightsLarge.body.sm,
      },
      tag: {
        fontSize: fontSizeLarge.body.xs,
        lineHeight: lineHeightsLarge.body.xs,
      },
    },
  },
};
