const cysyncColors = {
  bullet: {
    white: '#ffffff',
  },
  gradients: {
    primary:
      'linear-gradient(102.78deg, #211C18 0%, #211A16 59.38%, #252219 100%)',
    secondary:
      '-webkit-linear-gradient( 90deg,#a2adb3 1.67%,#f3f1f2 35.99%,#bcc3c9 66.2%,#dcdfe4 100%)',
    content: 'linear-gradient(89.76deg, #16120F 0.23%, #1F1915 99.82%)',
    sideBar:
      'linear-gradient(102.78deg, #211C18 0%, #211A16 59.38%, #252219 100%)',
    golden:
      'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%)',
    highlight:
      'linear-gradient(269.94deg, #312B26 0.05%, rgba(26, 22, 18, 0) 51.82%)',
    silver:
      'linear-gradient(180deg, #A2ADB3 -2.08%, #F3F1F2 34.27%, #BCC3C9 66.28%, #DCDFE4 102.08%)',
    stripe: 'linear-gradient(90deg, #211C18 1.69%, #242018 100%)',
    goldenhint:
      'linear-gradient(263deg, rgba(139, 100, 41, 0.14) 5.24%, rgba(38, 34, 31, 0.00) 55.22%), #272320',
    silverhint:
      'linear-gradient(263deg, rgba(194, 194, 194, 0.14) 5.24%, rgba(38, 34, 31, 0.00) 55.22%), #272320',
    conicGradient: {
      default:
        'conic-gradient(from 0deg, transparent,90deg, transparent, 90deg, #E9B873 ,180deg, #FEDD8F, 270deg, #B78D51, 360deg ,transparent, 360deg, transparent)',
      secondary:
        'conic-gradient(from 0deg, #A2ADB3 ,33deg, #F3F1F2, 67deg, #BCC3C9, 101deg, #DCDFE4,135deg ,transparent, 135deg, transparent)',
      expirig:
        'conic-gradient(from 0deg, #FF624C ,270deg, #FF624C,270deg ,transparent, 270deg, transparent)',
      golden:
        'conic-gradient(from 0deg, #E9B873 ,30deg, #FEDD8F, 60deg, #B78D51, 90deg ,transparent, 90deg, transparent)',
      silver:
        'conic-gradient(from 0deg, transparent,135deg, transparent, 135deg, #A2ADB3 ,191deg, #F3F1F2, 247deg, #BCC3C9, 304deg, #DCDFE4, 360deg ,transparent, 360deg, transparent)',
      notExpiring:
        'conic-gradient(from 0deg, transparent, 270deg, transparent, 270deg, #E9B873 ,300deg, #FEDD8F, 330deg, #B78D51, 360deg ,transparent, 360deg, transparent)',
    },
    cardDefault:
      'linear-gradient(300deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 57.81%, rgba(0, 0, 0, 0.00) 100%), #2A2827',
    cardSelected:
      'linear-gradient(285deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 60.65%), #2A2827',
    cardHover:
      'linear-gradient(105deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 60.65%), #332F2D',
    title: `linear-gradient(90deg,#e9b873 0.19%,#fedd8f 37.17%,#b78d51 100.19%)`,
    plan: 'linear-gradient(90deg, rgba(224, 187, 117, 0.10) 0%, rgba(39, 35, 32, 0.00) 100%), #272320',
  },
  info: {
    main: '#F1AE4A',
  },
  warning: {
    main: '#FF624C',
  },
  success: {
    main: '#51C61A',
    secondary: '#3A5E2A',
  },
  disabled: {
    background: '#332E29',
    text: '#544D47',
  },
  text: {
    gold: 'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%)',
    silver:
      '-webkit-linear-gradient( 90deg,#a2adb3 1.67%,#f3f1f2 35.99%,#bcc3c9 66.2%,#dcdfe4 100%)',
    heading: '#FFFFFF',
    list: '#827B77',
    muted: '#8B8682',
    warn: '#F1AE4A',
    message: '#FFFFFF',
    error: '#FF624C',
    errorDark: '#74271C',
    success: '#51C61A',
    black: '#000000',
    white: '#ffffff',
    goldenrod: '#daa520',
    disabled: '#423D39',
    normal: '#CCC4BE',
    divider: '#333130',
    dialog: '#2B2420',
    separator: '#39322C',
    greenStroke: '#00FF75',
    redStroke: '#FF0202',
  },
  boxShadow: {
    selected: '#1B1813',
    timer: {
      main: '#2e2523',
      text: '#242322',
    },
  },
  background: {
    progressBar: '#1F1915',
    input: '#27221D',
    inputSecondary: '#3C3937',
    blur: 'rgba(29, 25, 23, 0.4)',
    separator: '#39322C',
    bar: '#3A3937',
    muted: '#8B8682',
    separatorSecondary: '#272320',
    gold: '#E9B873',
    infoGreenBg: '#1F271D',
    dropdownHover: '#191715',
    black: '#000000',
    container: '#1B1812',
    containerSecondary: '#3a3531',
    toggleOff: '#544D43',
    list: '#2C2824',
    info: '#4A2D00',
    lightBlack: '#1B1712',
    sidebar: '#1E1A15',
    slider: '#3A3531',
    warning: '#2C2418',
    message: '#1F271D',
    messageSecondary: '#2C2418',
    breadcrumbSeparator: '#333130',
    batchTransactionBody: '#1b1812',
    danger: '#FF624C',
    error: '#271D1D',
    filterItem: `#1F1C19`,
    calendar: '#342F2C',
    calendarHeader: '#211C18',
    timer: {
      main: '#3e3a38',
      default: '#261f17',
      silver: '#26221e',
      expiring: '#271a15',
      secondary: '#2a2827',
    },
    silver: '#a2adb3',
    slate: '#312d2a',
    cardDisabled: '#282522',
    cardSelected: '#2A2827',
    slateDark: '#423F3C',
    slateLight: '#302C29',
    headlineLight: '#655F53',
    cardActive: '#262423',
    videoError: '#14110f',
    featureBanner: '#282828',
  },
  border: {
    darkSlate: '#030303',
    popup: '#2C2520',
    list: '#2C2824',
    input: '#3C3937',
    separator: '#39322C',
    message: '#143E01',
    messageSecondary: '#4A2D00',
    warning: '#4A2D00',
    error: '#FF624C',
    danger: '#4A0900',
    bar: '#474747',
    table: {
      title: '#363535',
      row: '#2C2929',
      stripe: '#16120F',
    },
    muted: '#8B8682',
    white: '#ffffff',
    separatorSecondary: '#272320',
    gold: '#E9B873',
    infoBox: '#3c3c3c',
    infoBoxOrange: '#4A2D00',
    subMenuLeft: '#534B44',
    topbar: '#342C26',
    card: '#534A44',
    selected: '#e0bb74',
    success: '#51C61A',
    infoGreen: '#143E01',
  },
  shadow: {
    dropdown: '#0f0d0b',
  },
};

const demoOdixColors = {
  bullet: {
    white: '#000000',
  },
  gradients: {
    primary:
      'linear-gradient(102.78deg, #f5f5f5 0%, #e9e9e9 59.38%, #dadada 100%)',
    secondary:
      'linear-gradient(90deg, #f3f1f2 1.67%, #bcc3c9 35.99%, #a2adb3 66.2%, #909aa0 100%)',
    content: 'linear-gradient(89.76deg, #ffffff 0.23%, #f0f0f0 99.82%)',
    sideBar:
      'linear-gradient(102.78deg, #f5f5f5 0%, #e9e9e9 59.38%, #dadada 100%)',
    golden:
      'linear-gradient(90deg, #B78D51 0.19%, #FEDD8F 37.17%, #E9B873 100.19%)',
    highlight:
      'linear-gradient(269.94deg, #eeeae5 0.05%, rgba(255, 255, 255, 0) 51.82%)',
    silver:
      'linear-gradient(180deg, #DCDFE4 -2.08%, #BCC3C9 34.27%, #F3F1F2 66.28%, #A2ADB3 102.08%)',
    stripe: 'linear-gradient(90deg, #f5f5f5 1.69%, #e6e6e6 100%)',
    goldenhint:
      'linear-gradient(263deg, rgba(255, 213, 151, 0.14) 5.24%, rgba(255, 255, 255, 0) 55.22%), #fdf9f4',
    silverhint:
      'linear-gradient(263deg, rgba(194, 194, 194, 0.14) 5.24%, rgba(255, 255, 255, 0) 55.22%), #f9f9f9',
    conicGradient: {
      default:
        'conic-gradient(from 0deg, transparent,90deg, transparent, 90deg, #E9B873 ,180deg, #FEDD8F, 270deg, #B78D51, 360deg ,transparent, 360deg, transparent)',
      secondary:
        'conic-gradient(from 0deg, #DCDFE4 ,33deg, #BCC3C9, 67deg, #F3F1F2, 101deg, #A2ADB3,135deg ,transparent, 135deg, transparent)',
      expirig:
        'conic-gradient(from 0deg, #FF624C ,270deg, #FF624C,270deg ,transparent, 270deg, transparent)',
      golden:
        'conic-gradient(from 0deg, #B78D51 ,30deg, #FEDD8F, 60deg, #E9B873, 90deg ,transparent, 90deg, transparent)',
      silver:
        'conic-gradient(from 0deg, transparent,135deg, transparent, 135deg, #DCDFE4 ,191deg, #BCC3C9, 247deg, #F3F1F2, 304deg, #A2ADB3, 360deg ,transparent, 360deg, transparent)',
      notExpiring:
        'conic-gradient(from 0deg, transparent, 270deg, transparent, 270deg, #B78D51 ,300deg, #FEDD8F, 330deg, #E9B873, 360deg ,transparent, 360deg, transparent)',
    },
    cardDefault:
      'linear-gradient(300deg, rgba(223, 196, 165, 0.2) 0%, rgba(255, 255, 255, 0) 57.81%), #f7f7f7',
    cardSelected:
      'linear-gradient(285deg, rgba(223, 196, 165, 0.2) 0%, rgba(255, 255, 255, 0) 60.65%), #f7f7f7',
    cardHover:
      'linear-gradient(105deg, rgba(223, 196, 165, 0.2) 0%, rgba(255, 255, 255, 0) 60.65%), #ffffff',
    title:
      'linear-gradient(90deg,#B78D51 0.19%,#FEDD8F 37.17%,#E9B873 100.19%)',
    plan: 'linear-gradient(90deg, rgba(224, 187, 117, 0.1) 0%, rgba(255, 255, 255, 0.00) 100%), #f9f9f9',
  },
  info: {
    main: '#F1AE4A',
  },
  warning: {
    main: '#FF624C',
  },
  success: {
    main: '#51C61A',
    secondary: '#88B77B',
  },
  disabled: {
    background: '#E0E0E0',
    text: '#A0A0A0',
  },
  text: {
    gold: 'linear-gradient(90deg, #B78D51 0.19%, #FEDD8F 37.17%, #E9B873 100.19%)',
    silver:
      'linear-gradient(90deg,#dcdfe4 1.67%,#bcc3c9 35.99%,#f3f1f2 66.2%,#a2adb3 100%)',
    heading: '#000000',
    list: '#5C5C5C',
    muted: '#7E7E7E',
    warn: '#F1AE4A',
    message: '#000000',
    error: '#FF624C',
    errorDark: '#B71C1C',
    success: '#51C61A',
    black: '#000000',
    white: '#ffffff',
    goldenrod: '#daa520',
    disabled: '#A8A8A8',
    normal: '#3C3C3C',
    divider: '#CCCCCC',
    dialog: '#f2f2f2',
    separator: '#e6e6e6',
    greenStroke: '#00FF75',
    redStroke: '#FF0202',
  },
  boxShadow: {
    selected: '#d0d0d0',
    timer: {
      main: '#e6e6e6',
      text: '#cccccc',
    },
  },
  background: {
    progressBar: '#e0e0e0',
    input: '#f5f5f5',
    inputSecondary: '#eeeeee',
    blur: 'rgba(240, 240, 240, 0.4)',
    separator: '#e6e6e6',
    bar: '#dcdcdc',
    muted: '#7E7E7E',
    separatorSecondary: '#f0f0f0',
    gold: '#E9B873',
    infoGreenBg: '#e9f7e9',
    dropdownHover: '#f0f0f0',
    black: '#ffffff',
    container: '#ffffff',
    containerSecondary: '#f5f5f5',
    toggleOff: '#d4d4d4',
    list: '#fafafa',
    info: '#FFF4E5',
    lightBlack: '#f7f7f7',
    sidebar: '#f5f5f5',
    slider: '#eaeaea',
    warning: '#FFF4F0',
    message: '#F1F9F1',
    messageSecondary: '#FFF4E5',
    breadcrumbSeparator: '#CCCCCC',
    batchTransactionBody: '#ffffff',
    danger: '#FF624C',
    error: '#FFD2D2',
    filterItem: '#f5f5f5',
    calendar: '#ffffff',
    calendarHeader: '#f5f5f5',
    timer: {
      main: '#eeeeee',
      default: '#e6e6e6',
      silver: '#f0f0f0',
      expiring: '#ffe8e1',
      secondary: '#f2f2f2',
    },
    silver: '#bcc3c9',
    slate: '#f0f0f0',
    cardDisabled: '#f4f4f4',
    cardSelected: '#f7f7f7',
    slateDark: '#cccccc',
    slateLight: '#e0e0e0',
    headlineLight: '#a59d8f',
    cardActive: '#e8e8e8',
    videoError: '#fafafa',
    featureBanner: '#f9f9f9',
  },
  border: {
    darkSlate: '#f0f0f0',
    popup: '#eaeaea',
    list: '#fafafa',
    input: '#eeeeee',
    separator: '#e6e6e6',
    message: '#cdeac0',
    messageSecondary: '#ffe6cc',
    warning: '#ffccbc',
    error: '#FF624C',
    danger: '#d32f2f',
    bar: '#cccccc',
    table: {
      title: '#f0f0f0',
      row: '#f9f9f9',
      stripe: '#ffffff',
    },
    muted: '#7E7E7E',
    white: '#000000',
    separatorSecondary: '#f0f0f0',
    gold: '#E9B873',
    infoBox: '#e0e0e0',
    infoBoxOrange: '#ffe6cc',
    subMenuLeft: '#dcdcdc',
    topbar: '#f7f7f7',
    card: '#eaeaea',
    selected: '#B78D51',
    success: '#51C61A',
    infoGreen: '#cdeac0',
  },
  shadow: {
    dropdown: '#d0d0d0',
  },
};

const colors =
  (window as any).cysyncEnv.VENDOR === 'odix' // Vendor specific color example
    ? demoOdixColors
    : cysyncColors;

export { colors };
