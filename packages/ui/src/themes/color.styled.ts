export const colors = {
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
    videoError: '#14110f',
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
  },
  shadow: {
    dropdown: '#0f0d0b',
  },
};
