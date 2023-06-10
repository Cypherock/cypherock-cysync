const en = {
  x1Card: 'X1 Card',
  help: 'Help',
  back: 'Back',
  buttons: {
    continue: 'Continue',
    confirm: 'Confirm',
  },
  onboarding: {
    info: {
      aside: {
        title: 'Welcome to CySync App',
        subTitle: 'Your Gateway to Self-Sovereignty',
      },
      dialogBox: {
        title: 'Ensure the following before you continue',
        listItems: [
          'You are present in a safe and secure environment',
          'You have atleast 15-30 minutes to setup your wallet',
          'You have an active internet connection',
          'The tamper-proof seal of the package is intact',
          'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
          'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
        ],
      },
    },
    usage: {
      titleFirst: 'I am using Cypherock X1 for the first time',
      titleSecond: 'I have already used a Cypherock X1',
      subTitleFirst: 'Choose this if you have never used Cypherock X1 before',
      subTitleSecond:
        'Choose this if you want to migrate your wallets to a new Cypherock X1. This might be required in case your lost your X1 wallet and one or more of the X1 cards.',
    },
    terms: {
      title: 'Terms of use',
      bulletPoints: {
        terms: 'Terms Of Service',
        privacyPolicy: 'Privacy Policy',
      },
      consent:
        ' I have read and agree with the Terms of Use and Privacy Policy',
    },
    setPassword: {
      heading: 'Set Password',
      title: 'Set your cySync password ',
      success: 'Your new password is set',
      newPasswordLabel: 'New Password',
      confirmPasswordLabel: 'Confirm Password',
      hint: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    },
    emailAuth: {
      heading: 'Email Auth',
      title:
        'You are recommended to enter an email ID as a 2FA to get authenticity results ',
      success: 'Your new password is set',
      enterEmailLabel: 'Your Email',
    },
    deviceDetection: {
      heading: 'Device Connection',
      title: 'Connect your X1 Vault to your PC to proceed',
      subtext:
        'Use the USB cable provided in your product packaging to connect',
    },
    deviceAuth: {
      heading: 'Device Authentication',
      subtext:
        'Your X1 Vault will now be authenticated\nthrough Cypherock to check its\nauthenticity',
      success: 'Your X1 Vault is successfully authenticated',
    },
    joystickTraining: {
      heading: 'Joystick Checkup',
      subtext: 'X1 Vault provides 4 way joystick for\nscreen navigation',
      upTitle: 'Toggle Up',
      rightTitle: 'Toggle Right',
      downTitle: 'Toggle Down',
      leftTitle: 'Toggle Left',
      centerTitle: 'Center click the joystick to proceed',
      centerSubtext: 'X1 Vault has a center button to\nperform click',
      footer: 'Follow the instruction on the device',
      success: 'Your X1 Vault is successfully authenticated',
    },
    cardTraining: {
      heading: 'Card Tap Checkup',
      title: 'Tap any X1 Card below the X1 Vault to test card tapping',
    },
    cardAuth: {
      heading: 'Card Authentication',
      title: 'Tap X1 Cards one by one below the\nX1 Vault',
      subtext: 'Do not lift until you hear 3 beep sounds',
    },
    success: {
      title: 'Congratulations',
      subtext: 'Cypherock X1 is now ready to use',
    },
  },
};

export type LanguageStrings = typeof en;

export default en;
