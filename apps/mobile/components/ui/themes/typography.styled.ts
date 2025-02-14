export const fontSize = {
  heading: {
    display1: 28,
    h1: 22,
    h2: 20,
    h3: 16,
    h4: 14,
    h5: 12,
    h6: 10,
  },
  body: {
    lg: 14,
    base: 12,
    sm: 10,
    xs: 8,
  },
};

export const lineHeights = {
  heading: {
    display1: Math.round(fontSize.heading.display1 * 1.5),
    h1: Math.round(fontSize.heading.h1 * 1.5),
    h2: Math.round(fontSize.heading.h2 * 1.5),
    h3: Math.round(fontSize.heading.h3 * 1.5),
    h4: Math.round(fontSize.heading.h4 * 1.5),
    h5: Math.round(fontSize.heading.h5 * 1.5),
    h6: Math.round(fontSize.heading.h6 * 1.5),
  },
  body: {
    lg: Math.round(fontSize.body.lg * 1.5),
    base: Math.round(fontSize.body.base * 1.5),
    sm: Math.round(fontSize.body.sm * 1.5),
    xs: Math.round(fontSize.body.xs * 1.5),
  },
};

export const fontSizeLarge = {
  heading: {
    display1: 35,
    h1: 27.5,
    h2: 25,
    h3: 20,
    h4: 17.5,
    h5: 15,
    h6: 12.5,
  },
  body: {
    lg: 17.5,
    base: 15,
    sm: 13.75,
    xs: 10,
  },
};

export const lineHeightsLarge = {
  heading: {
    display1: Math.round(fontSizeLarge.heading.display1 * 1.5),
    h1: Math.round(fontSizeLarge.heading.h1 * 1.5),
    h2: Math.round(fontSizeLarge.heading.h2 * 1.5),
    h3: Math.round(fontSizeLarge.heading.h3 * 1.5),
    h4: Math.round(fontSizeLarge.heading.h4 * 1.5),
    h5: Math.round(fontSizeLarge.heading.h5 * 1.5),
    h6: Math.round(fontSizeLarge.heading.h6 * 1.5),
  },
  body: {
    lg: Math.round(fontSizeLarge.body.lg * 1.5),
    base: Math.round(fontSizeLarge.body.base * 1.5),
    sm: Math.round(fontSizeLarge.body.sm * 1.5),
    xs: Math.round(fontSizeLarge.body.xs * 1.5),
  },
};

export const fontWeight = {
  bold: 600,
  medium: 500,
  regular: 400,
};

export const fontFamily = {
  poppins: 'Poppins',
};
