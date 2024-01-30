/* eslint-disable no-template-curly-in-string */
import { GetLogsErrorType } from '@cypherock/sdk-app-manager';
import {
  DeviceAppErrorType,
  DeviceBootloaderErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceConnectionErrorType,
  CardAppErrorType,
} from '@cypherock/sdk-interfaces';

import { ServerErrorType } from '~/errors';
import { DeviceErrorCodes, IErrorMsg } from '~/types/deviceError';

const deviceErrors: Record<DeviceErrorCodes, IErrorMsg> = {
  // Connection Errors
  [DeviceConnectionErrorType.NOT_CONNECTED]: {
    heading: 'Connect the X1 Vault to your PC to proceed',
  },
  [DeviceConnectionErrorType.CONNECTION_CLOSED]: {
    heading: 'Connect the X1 Vault to your PC to proceed',
  },
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]: {
    heading: 'Your X1 Vault is unable to connect',
    subtext: 'Reconnect the device and try again',
  },

  // Communication Errors
  [DeviceCommunicationErrorType.IN_BOOTLOADER]: {
    heading: 'Your X1 Vault is in safe mode',
    subtext: 'Update your device to proceed',
  },
  [DeviceCommunicationErrorType.WRITE_REJECTED]: {
    heading: 'Your X1 Vault is facing some communication issues',
    subtext: 'Reconnect the device and try again',
  },
  [DeviceCommunicationErrorType.WRITE_ERROR]: {
    heading: 'Your X1 Vault is facing some communication issues',
    subtext: 'Reconnect the device and try again',
  },
  [DeviceCommunicationErrorType.WRITE_TIMEOUT]: {
    heading: 'Your X1 Vault is facing some communication issues',
    subtext: 'Reconnect the device and try again',
  },
  [DeviceCommunicationErrorType.READ_TIMEOUT]: {
    heading: 'Your X1 Vault is facing some communication issues',
    subtext: 'Reconnect the device and try again',
  },
  [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]: {
    heading: 'Your X1 Vault is facing some communication issues',
    subtext: 'Reconnect the device and try again',
  },

  // Compatibility Errors
  [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]: {
    heading: 'Your X1 Vault does not support this operation',
    subtext: 'Update the cySync app and the device to the latest version',
  },
  [DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED]: {
    heading: 'Your X1 Vault is not compatible with the cySync app',
    subtext: 'Update the cySync app and the device to the latest version',
  },

  // Bootloader Errors
  [DeviceBootloaderErrorType.NOT_IN_BOOTLOADER]: {
    heading: 'Operation failed on the X1 Vault',
    subtext: 'Reconnect the device and try again',
  },
  [DeviceBootloaderErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]: {
    heading: 'Your X1 Vault does not support this firmware',
    subtext: 'Contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.WRONG_HARDWARE_VERSION]: {
    heading: 'Your X1 Vault does not support this firmware',
    subtext: 'Contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.WRONG_MAGIC_NUMBER]: {
    heading: 'Your X1 Vault does not support this firmware',
    subtext: 'Contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.SIGNATURE_NOT_VERIFIED]: {
    heading: "Your X1 Vault's firmware is not authentic",
    subtext:
      'It usually happens when you are trying to install a firmware not developed by Cypherock',
  },
  [DeviceBootloaderErrorType.LOWER_FIRMWARE_VERSION]: {
    heading: 'Your X1 Vault cannot be updated to a lower firmware version',
    subtext:
      'The device only supports updating the firmware to a higher version',
  },
  [DeviceBootloaderErrorType.FLASH_WRITE_ERROR]: {
    heading: 'X1 Vault update failed',
    subtext:
      'Reconnect the device, try again and if the problem persists, contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.FLASH_CRC_MISMATCH]: {
    heading: 'Your X1 Vault does not support this firmware',
    subtext: 'Contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.FLASH_TIMEOUT_ERROR]: {
    heading: 'Your X1 Vault is facing some communication issues',
    subtext:
      'Reconnect the device, try again and if the problem persists, contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.FLASH_NACK]: {
    heading: 'Something went wrong',
    subtext:
      'Reconnect the device, try again and if the problem persists, contact Cypherock support for assistance',
  },
  [DeviceBootloaderErrorType.NOT_IN_RECEIVING_MODE]: {
    heading: 'Your X1 Vault is facing communication issues',
    subtext:
      'Reconnect the device, try again and if the problem persists, contact Cypherock support for assistance',
  },

  // App Errors
  [DeviceAppErrorType.UNKNOWN_ERROR]: {
    heading: 'Something went wrong',
    subtext:
      'Reconnect the device, try again and if the problem persists, contact Cypherock support for assistance',
  },
  [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]: {
    heading: 'Your X1 Vault is currently busy',
    subtext: 'Navigate to main menu in device and try again',
  },
  [DeviceAppErrorType.PROCESS_ABORTED]: {
    heading: 'Your X1 Vault aborted this operation',
    subtext: 'You can resume it from where you last left',
  },
  [DeviceAppErrorType.DEVICE_ABORT]: {
    heading: 'Your X1 Vault aborted this operation',
    subtext:
      'Reconnect the device try again and if the problem persists, contact Cypherock support for assistance',
  },
  [DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]: {
    heading: 'Your X1 Vault is facing communication issues',
    subtext:
      'Reconnect the device, try again and if the problem persists contact Cypherock support for assistance',
  },
  [DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE]: {
    heading: 'Your X1 Vault is facing communication issues',
    subtext:
      'Reconnect the device, try again and if the problem persists contact Cypherock support for assistance',
  },
  [DeviceAppErrorType.INVALID_MSG]: {
    heading: 'Your X1 Vault is facing communication issues',
    subtext:
      'Reconnect the device, try again and if the problem persists contact Cypherock support for assistance',
  },
  [DeviceAppErrorType.UNKNOWN_APP]: {
    heading: 'The app does not exist on device',
  },
  [DeviceAppErrorType.APP_NOT_ACTIVE]: {
    heading: 'Your X1 Vault is currently busy',
    subtext:
      'Try again after sometime, if problem persists then reconnect device.',
  },
  [DeviceAppErrorType.DEVICE_SETUP_REQUIRED]: {
    heading: 'Your X1 Vault is currently not setup properly',
    subtext: 'Press continue to start the setup',
  },
  [DeviceAppErrorType.WALLET_NOT_FOUND]: {
    heading:
      'You have deleted the wallet ${walletName} from the X1 Vault. Do you want to delete it from the cySync app as well?',
  },
  [DeviceAppErrorType.WALLET_PARTIAL_STATE]: {
    heading:
      'Your wallet ${walletName} is currently misconfigured on your X1 Vault',
    subtext:
      'Go to wallet ${walletName} from the main menu on your device to resolve the issue',
  },
  [DeviceAppErrorType.APP_TIMEOUT]: {
    heading: 'Your X1 Vault has timed-out',
    subtext: 'Navigate to the main menu on the device and try again',
  },
  [DeviceAppErrorType.CARD_OPERATION_FAILED]: {
    heading: 'Unknown X1 Card error',
    subtext: 'Retry or click Help to find a solution',
  },
  [DeviceAppErrorType.USER_REJECTION]: {
    heading: 'You canceled this operation on your X1 Vault',
  },
  [DeviceAppErrorType.CORRUPT_DATA]: {
    heading: 'Your X1 Vault is facing communication issues',
    subtext: 'Retry or contact Cypherock support for assistance',
  },
  [DeviceAppErrorType.DEVICE_AUTH_FAILED]: {
    heading:
      'Device seems to be Compromised. Contact Cypherock support immediately',
  },
  [DeviceAppErrorType.CARD_AUTH_FAILED]: {
    heading:
      'Card seems to be Compromised. Contact Cypherock support immediately',
  },

  // Card Errors
  [CardAppErrorType.UNKNOWN]: {
    heading: 'Unknown X1 Card error',
    subtext:
      'Retry and if the problem persists, contact Cypherock support for assistance ',
  },
  [CardAppErrorType.NOT_PAIRED]: {
    heading: 'Your X1 Card is currently not paired with your X1 Vault',
    subtext:
      'Pair your card by going to settings from the main menu on your device before performing an operation',
    deviceNavigationText: 'Main menu > Settings > Pair Card',
  },
  [CardAppErrorType.SW_INCOMPATIBLE_APPLET]: {
    heading: 'Your X1 Card authentication failed',
    subtext:
      'Try a different card and if the problem persists, contact Cypherock support for assistance',
  },
  [CardAppErrorType.SW_NULL_POINTER_EXCEPTION]: {
    heading: 'Your X1 Card has malfunctioned',
    subtext: 'Retry or click Help to find a solution',
  },
  [CardAppErrorType.SW_TRANSACTION_EXCEPTION]: {
    heading: 'Your X1 Card is facing some communication issues',
    subtext: 'Retry or click Help to find a solution',
  },
  [CardAppErrorType.SW_FILE_INVALID]: {
    heading: 'You tapped an incorrect X1 Card',
    subtext: 'Make sure your card belongs to the same set',
  },
  [CardAppErrorType.SW_SECURITY_CONDITIONS_NOT_SATISFIED]: {
    heading: 'Your X1 Card is facing some communication issues',
    subtext:
      'Retry and if the problem persists, contact Cypherock support for assistance ',
  },
  [CardAppErrorType.SW_CONDITIONS_NOT_SATISFIED]: {
    heading: 'You tapped an incorrect X1 Card',
    subtext: 'Please tap the cards in the correct sequence',
  },
  [CardAppErrorType.SW_WRONG_DATA]: {
    heading: 'Your X1 Card is facing some communication issues',
    subtext:
      'Retry and if the problem persists, contact Cypherock support for assistance ',
  },
  [CardAppErrorType.SW_FILE_NOT_FOUND]: {
    heading: 'Your X1 Card is facing some communication issues',
    subtext: 'Contact Cypherock support for assistance',
  },
  [CardAppErrorType.SW_RECORD_NOT_FOUND]: {
    heading: 'Your X1 Card is out of sync with your X1 Vault',
    subtext:
      'Resync your card by going to wallet ${walletName} from the main menu on your device before performing an operation',
  },
  [CardAppErrorType.SW_FILE_FULL]: {
    heading: "Your X1 Card's memory is full",
    subtext:
      'You can delete a wallet to add a new one or buy another Cypherock X1',
  },
  [CardAppErrorType.SW_CORRECT_LENGTH_00]: {
    heading: 'You entered an incorrect PIN',
    subtext: 'Enter the correct PIN before the card gets locked',
  },
  [CardAppErrorType.SW_INVALID_INS]: {
    heading: 'Your X1 Card is facing some communication issues',
    subtext: 'Contact Cypherock support for assistance',
  },
  [CardAppErrorType.SW_NOT_PAIRED]: {
    heading: 'Your X1 Card needs to be paired with your X1 Vault',
    subtext:
      'You can start card pairing from settings in the device or you can use a different set of cards',
  },
  [CardAppErrorType.SW_CRYPTO_EXCEPTION]: {
    heading: 'Your X1 Card is facing some communication issues',
    subtext: 'Contact Cypherock support for assistance',
  },
  [CardAppErrorType.POW_SW_WALLET_LOCKED]: {
    heading: 'The wallet ${walletName} is currently locked on your X1 Vault',
    subtext: 'Unlock the wallet first before trying again',
    deviceNavigationText: 'Main Menu > ${walletName}',
  },
  [CardAppErrorType.SW_INS_BLOCKED]: {
    heading: 'Your X1 Card has malfunctioned',
    subtext: 'Click Help to find a solution',
  },
  [CardAppErrorType.SW_OUT_OF_BOUNDARY]: {
    heading: 'Your X1 Card has malfunctioned',
    subtext: 'Retry or click Help to find a solution',
  },
  [CardAppErrorType.UNRECOGNIZED]: {
    heading: 'Unknown X1 Card error',
    subtext: 'Retry or click Help to find a solution',
  },

  // Manager App Errors
  [GetLogsErrorType.LOGS_DISABLED]: {
    heading: 'Logs are disabled on X1 Vault',
    subtext: 'Enable logs on X1 Vault settings and try again',
  },
};

const databaseError = {
  heading: 'Your cySync app is facing some internal issue',
  subtext:
    'Try again and if the problem persists, contact Cypherock support for assistance',
};

const serverErrors: Record<ServerErrorType, IErrorMsg> = {
  [ServerErrorType.UNKNOWN_ERROR]: {
    heading: 'Your cySync app is facing some connectivity issue',
    subtext:
      'Reconnect the device and try again and if the problem persists, contact Cypherock support for assistance',
  },
  [ServerErrorType.CONNOT_CONNECT]: {
    heading: 'Please connect to the internet to continue',
  },
};

const en = {
  x1Card: 'X1 Card',
  help: 'Help',
  back: 'Back',
  allWallets: 'All Wallets',
  buttons: {
    addWallet: 'Add Wallet',
    addAccount: 'Add Account',
    syncWallets: 'Sync Wallets',
    addToken: 'Add Token',
    reverify: 'Reverify',
    continue: 'Continue',
    confirm: 'Confirm',
    skip: 'Skip',
    send: 'Send',
    receive: 'Receive',
    back: 'Back',
    retry: 'Retry',
    update: 'Update',
    cancel: 'Cancel',
    reset: 'Reset',
    done: 'Done',
    close: 'Close',
    report: 'Report',
    help: 'Help',
    stop: 'Stop',
    exit: 'Exit',
    resync: 'Resync',
    showAll: 'Show All',
    connect: 'Connect',
    disconnect: 'Disconnect',
    reject: 'Reject',
    check: 'Check',
    authenticate: 'Authenticate',
    start: 'Start',
    setPassword: 'Set Password',
    changePassword: 'Change Password',
    removePassword: 'Remove Password',
    details: 'Details',
    showQRCode: 'Show QR Code',
    editAccount: 'Edit Account',
    submit: 'Submit',
    showMore: 'Show more',
  },
  deviceAuthentication: {
    success: {
      title: 'Your X1 Vault is authenticated successfully',
    },
    loading: {
      title: 'Please wait while your X1 Vault is being authenticated',
      subtitle:
        'Do not disconnect your X1 Vault while the operation is being done',
    },
  },
  lockscreen: {
    title: 'Your Gateway to Self-Sovereignty',
    passwordLabel: 'Enter Password to unlock cySync',
    forgotPassword: 'Forgot password?',
    incorrectPassword: 'Incorrect password',
    button: 'Unlock',
    forgotPasswordDialog: {
      title:
        'Resetting password will reset your cySync app do you want to proceed?',
      subtext:
        'This will erase all your data on your cySync app. Note this will not result in loss of assets',
    },
  },
  permissionSetup: {
    title:
      'Press run the following command on your terminal to allow the application to access usb port',
    subtext: 'Restart the application after running the script',
    checkbox: 'I have already run the command',
  },
  addAccount: {
    header: 'Add Account',
    select: {
      header: 'Select the Wallet & Coins you want to add',
      searchText: 'Search',
      walletPlaceholder: 'Choose a wallet',
      coinPlaceholder: 'Choose a coin',
    },
    deviceActions: {
      header: 'Follow instructions on the X1 Vault',
      subtext: 'Add a coin/account to wallet',
      walletName: '${walletName}',
      actions: {
        verifyCoin: 'Verify the coins on the device',
        enterPassphrase: 'Enter passphrase',
        enterPin: 'Enter the PIN and tap any card',
        tapCard: 'Tap any card',
      },
    },
    sync: {
      syncingHeader: 'Syncing the account',
      header: 'Add new accounts',
      newAccount: 'New Accounts',
      advancedButton: 'Show all address types',
      accountsNotSynced: 'Account not yet synced (${count})',
      deselectAllButton: 'Deselect all',
      selectAllButton: 'Select all',
      accountsInPortfolio: 'Accounts already in portfolio (${count})',
      addAccountButton: 'Add Accounts',
      resyncButton: 'Resync',
    },
    congrats: {
      header: 'Add Coin/Account',
      subtext: 'Add other accounts or return to portfolio',
      title: 'Accounts added successfully',
      buttonAddMore: 'Add more',
    },
    aside: {
      tabs: {
        asset: 'Asset',
        device: 'X1 Vault',
        confirmation: 'Confirmation',
      },
    },
  },
  addToken: {
    header: 'Add Token',
    select: {
      header: 'Select the wallet, account & tokens you want to add',
      searchText: 'Search',
      walletPlaceholder: 'Select Wallet',
      tokenPlaceholder: 'Select Tokens',
      accountPlaceholder: 'Select Accounts',
      message:
        'Ethereum account needs to be added first to continue adding the tokens',
    },
    congrats: {
      title: 'Tokens added successfully',
      subtitle: 'Add other tokens or return to portfolio',
      buttonAddMore: 'Add more Tokens',
    },
  },
  receive: {
    title: 'Receive',
    showAnywayButton: "Don't have your device?",
    source: {
      title: 'Receive',
      subtitle: 'Choose a wallet and account to credit',
      searchText: 'Search',
      walletPlaceholder: 'Choose a wallet',
      accountPlaceholder: 'Account to credit',
    },
    x1Vault: {
      title: 'Follow instructions on the X1 Vault',
      subtitle: 'Confirm the operation on your device to finalize',
      actions: {
        verifyCoin: 'Verify the asset and wallet name on the device',
        enterPassphrase: 'Enter passphrase',
        enterPin: 'Enter the PIN and tap any card',
        tapCard: 'Tap any card',
      },
    },
    receive: {
      title: {
        prefix: 'Address for ',
        suffix: 'in ${walletName}',
      },
      addressLabel: 'Address',
      actions: {
        verify:
          'Verify the address on X1 Vault exactly matches the address displayed above',
      },
      messageBox: {
        warning:
          'This Receive Address was NOT VERIFIED by the device. Use it at your own risk',
      },
    },
    congrats: {
      title: 'Address verified successfully',
    },
    finalButtons: {
      secondary: 'Verify Again',
      secondaryUnverified: 'Verify Address',
      primary: 'Done',
    },
    aside: {
      tabs: {
        source: 'Source',
        device: 'X1 Vault',
        receive: 'Receive',
      },
    },
  },
  send: {
    title: 'Send',
    fees: {
      header: [
        { id: 1, label: 'Standard', type: 'slider' },
        { id: 2, label: 'Advanced', type: 'input' },
      ],
      sliderLabels: [
        { id: 1, name: 'Min' },
        { id: 2, name: 'Average' },
        { id: 3, name: 'Max' },
      ],
      inputLabels: {
        gasPrice: 'Gas Price',
        gasLimit: 'Gas Limit',
      },
    },
    source: {
      title: 'Source',
      subtitle: 'Choose a wallet and an account',
      searchText: 'Search',
      walletPlaceholder: 'Choose a wallet',
      accountPlaceholder: 'Account to debit',
    },
    x1Vault: {
      title: 'Follow instructions on the X1 Vault',
      actions: {
        verifyCoin: 'Verify',
        verifyDetails: 'Verify transaction details on device',
        enterPassphrase: 'Enter passphrase',
        enterPin: 'Enter the PIN and tap any card',
        tapCard: 'Tap any card',
      },
      token: {
        info: 'Remember ${tokenName} is an ${parentCoinName} token therefore fee will be calculated in ${parentCoinUnit}',
      },
      messageBox: {
        warning:
          'Always verify the address displayed on your device exactly matches the address given by the recipient',
      },
    },
    recipient: {
      title: 'Recipient',
      subtitle:
        'Enter the amount and the address of the recipient to whom you want to send the funds',
      recipient: {
        label: 'Recipient Address',
        placeholder: 'Enter address',
        error: 'Invalid address',
      },
      tabs: {
        single: 'Single Transaction',
        batch: 'Batch Transaction',
      },
      amount: {
        label: 'Amount to send',
        placeholder: '0',
        toggle: 'Send Max',
        dollar: '$',
        error: 'Insufficient funds',
        notOverDustThreshold: 'Amount is lower than dust limit',
      },
      fees: {
        title: 'Fees',
        label: 'Network Fees',
      },
      warning: 'Transaction might cancel if fees is very low',
      feeError: 'Transaction with 0 fee is not allowed',
      notEnoughBalance: 'Insufficient funds for transaction',
      toggleText: {
        replace: 'Allow the transaction to be replaced (Replace by fees)',
        unconfirmed: 'Include coins from unconfirmed, replaceable transactions',
      },
      infoBox: 'Maximum spendable amount is ',
      addButton: 'Add another recipient',
    },
    summary: {
      title: 'Summary',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      network: 'Network Fee',
      debit: 'Total to debit',
    },

    finalMessage: {
      button: 'Check transactions',
      title: 'Transaction Sent',
      hashLabel: 'Transaction Hash',
      messageBox: {
        warning:
          'Your account balance will be updated when the blockchain confirms the transaction',
      },
    },
    aside: {
      tabs: {
        source: 'Source',
        recipient: 'Recipient',
        summary: 'Summary',
        x1vault: 'X1 Vault',
        confirm: 'Confirmation',
      },
    },
    optimism: {
      deviceAction:
        "L1 Fee: ${fee}. Your L1 fee won't be verified from the device",
      l1: ' (L1)',
      l2: ' (L2)',
      suffix: ' (L1 + L2)',
    },
  },
  history: {
    tableTitle: 'Transactions',
    tableHeader: {
      time: 'Time',
      asset: 'Asset',
      walletAndAccount: 'Wallet / Account',
      wallet: 'Wallet',
      account: 'Account',
      amount: 'Amount',
      value: 'Value',
    },
    //! Fields used as keys in getDisplayTransactionType, modify with caution
    transactionStatus: {
      send: {
        failed: 'Send Failed',
        pending: 'Sending',
        success: 'Sent',
      },
      receive: {
        failed: 'Receive Failed',
        pending: 'Receiving',
        success: 'Received',
      },
    },
    dialogBox: {
      value: 'Value',
      view: 'View in explorer',
      fee: 'Fee',
      type: 'Type',
      status: 'Status',
      wallet: 'Wallet',
      account: 'Account',
      asset: 'Asset',
      sender: 'Sender',
      receiver: 'Receiver',
      mine: 'Mine',
      transactionHash: 'Transaction Hash',
      description: 'Description',
      feePrefix: {
        optimism: 'L2 ',
      },
    },
    noData: {
      text: 'No transactions yet',
      subText: 'Receive Crypto today to see your transaction history here',
      buttonText: 'Receive',
    },
    search: {
      placeholder: 'Search...',
      notFound: {
        text: 'No results found for',
        subText: 'Please try searching another keywords',
      },
    },
  },
  onboarding: {
    info: {
      aside: {
        title: 'Welcome to cySync app',
        subTitle: 'Your Gateway to Self-Sovereignty',
      },
      dialogBox: {
        title: 'Ensure the following before you continue',
        listItems: [
          'You are present in a safe and secure environment',
          'You have at least 10-15 minutes to setup your wallet',
          'You have an active internet connection',
          'The tamper-proof seal of the package is intact',
          'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
          'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
        ],
      },
    },
    usage: {
      userNew: {
        title: 'I am using Cypherock X1 for the first time',
        note: 'Choose this if you have never used Cypherock X1 before',
      },
      userExpert: {
        title: 'I have already used a Cypherock X1',
        note: 'Choose this if you want to migrate your wallets to a new Cypherock X1. This might be required in case you lost your X1 Vault and one or more of the X1 Cards',
      },
    },
    terms: {
      title: 'Terms of Use',
      subtext:
        'Take some time to review our Terms of Service and Privacy Policy',
      bulletPoints: {
        terms: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
      },
      consent: 'I have read and agree with the Terms of Use and Privacy Policy',
    },
    setPassword: {
      heading: 'Set Password',
      title: 'Set your cySync password ',
      subtitle: 'We do not store your password on our servers',
      success: 'Your cySync password has been successfully set',
      newPasswordLabel: 'New Password',
      confirmPasswordLabel: 'Confirm Password',
      hint: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    },
    emailAuth: {
      heading: 'Email Auth',
      title:
        'You are recommended to enter an email ID as a 2FA to get authenticity results ',
      subtitle: 'We do not store this email ID permanently on our servers ',
      success: 'Your cySync password has been successfully set',
      enterEmailLabel: 'Email',
      placeholder: 'Email',
    },
    deviceDetection: {
      heading: 'Device Connection',
      title: 'Connect your X1 Vault to your PC to proceed',
      unavailable: {
        title: 'Your X1 Vault is unable to communicate',
        subtext: 'Try reconnecting the device',
      },
    },
    deviceAuth: {
      heading: 'Device Authentication',
      title:
        'Your X1 Vault will now be authenticated\nthrough Cypherock server to check its\nauthenticity ',
      subtext:
        'Do not disconnect your device while the operation is being done',
      success: {
        title: 'Your X1 Vault is successfully authenticated',
        subtext: 'Wait while we take you to the next screen',
      },
      error: 'X1 Vault authentication has failed',
    },
    joystickTraining: {
      heading: 'Joystick Instructions',
      subtext: 'X1 Vault provides 4 way joystick for screen navigation',
      upTitle: 'Toggle Up',
      rightTitle: 'Toggle Right',
      downTitle: 'Toggle Down',
      leftTitle: 'Toggle Left',
      centerTitle: 'Center click the joystick to proceed',
      centerSubtext: 'X1 Vault has a center button to perform click',
      footer: 'Follow the instructions on the device',
      success: 'Joystick instructions completed',
      error: 'Joystick instructions has failed',
    },
    cardTraining: {
      heading: 'Card Tapping Instructions',
      title: 'Tap any X1 Card below the X1 Vault to test card tapping',
      subtext:
        'Your cards communicate with the device through encrypted NFC. Make sure you keep it tapped until you hear a beep sound',
      error: 'Card Tapping has failed',
    },
    cardAuth: {
      heading: 'Card Authentication',
      title:
        'Tap X1 Cards one by one below the \nX1 Vault till you hear 3 beep sounds',
      subtext: 'Lift your card after 3 beep sounds',
    },
    walletActionsDialogBox: {
      title:
        "Let's create a wallet before we proceed. Make sure you have all the 4 X1 Cards with you",
      subTitle:
        'The following tutorials are just there to guide you on your device. You can create a wallet even without these tutorials independently on your Cypherock X1',
      createWallet: {
        title: 'Create a new wallet',
        list: [
          'If you have bought a brand new Cypherock X1 and want to setup a new wallet',
        ],
      },
      importWallet: {
        title: 'Import your wallet from a seed phrase',
        list: [
          `You want to use Cypherock X1 as a backup of your other wallets `,
          `You want to transfer your assets from your other wallets into Cypherock X1 `,
          `You want to manage and track portfolio of your other wallets through Cypherock X1 `,
        ],
      },
    },
    success: {
      title: 'Congratulations',
      subtext: 'Cypherock X1 is now ready to use',
    },
    appUpdate: {
      heading: 'App Update',
      dialogs: {
        checking: {
          heading: 'App Update',
          title: 'Please wait while we check for Cypherock CySync updates',
        },
        checkingFailed: {
          heading: 'App Update',
          title: 'An error occurred while checking for update',
          subtext:
            'Something went wrong, check your internet connection and try again',
        },
        confirmation: {
          heading: 'App Update',
          title:
            'A new update is available for your cySync app. Update the app to v${version} to continue',
          subtext:
            'Your X1 Vault seems to be incompatible with the current cySync app. Update your desktop app to v${version} to continue',
        },
        downloading: {
          heading: 'Updating...',
          subtext: 'Please wait while we update your cySync app',
          version: 'Version ${version}',
        },
        updateSuccessful: {
          heading: 'cySync app updated successfully',
          subtext:
            'Please wait while we restart the app to apply the latest update',
          bubbleText:
            'In case, the app does not restart itself, manually start it again',
        },
        updateFailed: {
          heading: 'cySync update to version ${version} failed',
          subtext:
            'Something went wrong, try updating again or contact support',
          buttons: {
            retry: 'Retry',
          },
        },
        updateFailedFallback: {
          heading: 'cySync app update to version ${version} failed',
          subtext: 'Download and reinstall the desktop app from the link below',
          alertText: 'Close this app before reinstalling the latest cySync app',
        },
      },
    },
    deviceUpdate: {
      heading: 'Device Update',
      version: 'Version ${version}',
      dialogs: {
        checking: {
          title: 'Please wait while we check for X1 Vault updates',
        },
        confirmation: {
          heading: 'Device Update',
          title:
            'A new update is available for your X1 Vault. Update the device to v${version} to continue',
          subtext: 'Follow the instructions on the device',
        },
        loading: {
          text: 'Please wait while we check for X1 Vault updates',
        },
        updating: {
          heading: 'Updating...',
          subtext: 'Please wait while we update your X1 Vault',
        },
        updateSuccessful: {
          heading: 'X1 Vault updated successfully',
          headingWithVersion: 'X1 Vault updated to v${version} successfully',
          subtext: 'Your device is now operating on the latest firmware',
        },
        updateFailed: {
          heading: 'Firmware update failed',
          subtext: 'Reconnect the device to proceed',
        },
      },
    },
  },
  appUpdateBar: {
    confirmation: 'Update to cySync version ${version} is available',
    downloading: 'Downloading cySync version ${version}',
    error: 'Error downloading cySync update',
    successful:
      'cySync update downloaded, it will install automatically when you close the app',
    buttons: {
      download: 'Download',
      tryAgain: 'Try Again',
      installUpdate: 'Install Update',
    },
  },
  deviceUpdateBar: {
    message: 'Firmware update version ${version} available',
    button: 'Download',
  },
  betaNotificationBar: {
    message: 'CySync v2.0.0 is available!',
    button: 'Learn More',
  },
  topbar: {
    statusTexts: {
      connection: {
        connected: 'Connected',
        disconnected: 'Disconnected',
        error: 'Connection error!',
      },
      sync: {
        synchronized: 'Synchronized',
        synchronizing: 'Synchronizing...',
        error: 'Sync error!',
        networkErrorTooltip: 'Network Error',
      },
    },
    notification: {
      title: 'Transactions',
      sendTransaction: '${amount} ${unit} ${type} to ${address}',
      sendTransactionMultiple:
        '${amount} ${unit} ${type} to multiple addresses',
      receiveTransaction:
        '${amount} ${unit} ${type} in the account ${walletName}/${accountName}',
      noTransactions: {
        title: 'All caught up',
        subTitle: 'No new transactions to show',
      },
    },
  },
  sidebar: {
    portfolio: 'Portfolio',
    wallets: 'Wallets',
    sendCrypto: 'Send Crypto',
    receiveCrypto: 'Receive Crypto',
    history: 'History',
    tutorial: 'Tutorial',
    settings: 'Settings',
    help: 'Help',
    tooltip: {
      walletDeleted:
        '${walletName} has been deleted from your Cypherock X1 Vault',
    },
  },
  walletSync: {
    deletedOne: {
      title:
        'Seems like you have deleted the wallet ${walletName} from the X1 Vault. Do you want to delete it on cySync as well?',
    },
    deletedMany: {
      title:
        'Seems like you have deleted wallets from the X1 Vault. Do you want to delete them from cySync as well?',
      subTitle: 'You can choose which ones to keep and which ones to delete',
    },
    freshOneCreated: {
      title:
        'Seems like you have deleted wallets from the X1 Vault while creating new ones by the same name. Do you want to delete the old wallets on cySync?',
      subTitle: 'You can choose which one to keep and which one to delete',
      checkboxText: "Don't show this again",
    },
    buttons: {
      keepIt: 'Keep it',
      keepAll: 'Keep All',
      delete: 'Delete',
    },
  },
  graph: {
    totalBalance: 'Total Balance',
    walletDropdown: {
      search: 'Search',
    },
    timeRange: {
      day: '1D',
      week: '1W',
      month: '1M',
      year: '1Y',
    },
  },
  walletConnect: {
    uriTab: {
      title: 'WalletConnect',
      subTitle: 'Enter WalletConnect URI to connect with the DApp',
      inputLabel: 'Enter connection URI',
      placeholder: 'Paste URI',
    },
    accountSelectionTab: {
      title: 'Connect to ${dappName} interface',
      chooseWallet: 'Choose a Wallet',
      chooseAccount: 'Select ${assetName} Accounts',
      supportInfo:
        'These blockchains are supported but add their accounts before use',
      notSupportedWarning: {
        title: 'These blockchains are not supported',
      },
    },
    accountConnectedTab: {
      title: 'Connected to ${dappName} interface',
      subTitle: 'Accounts',
      info: 'You can now access the ${dappName} DApp on your web browser',
    },
    common: {
      info: {
        title: 'This app will be able to:',
        points: [
          'Check your account balance and activity',
          'Request approvals for transactions',
        ],
      },
      error: {
        default: {
          title: 'Error occurred while connecting',
          subtitle: 'Retry the connection from the dApp',
        },
        unsupportedChains: {
          title:
            "${dappName} requested to connect to chain${s} we don't support yet",
          subtitle: 'We currently support ${chains}',
          message: 'Unsupported Chains: ${chains}',
        },
      },
      reject: {
        call: 'User rejected',
      },
    },
  },
  signMessage: {
    title: 'Sign Message',
    subTitle: 'Connected to the following account',
    actions: {
      confirmDevice: 'Confirm on device',
      verifyData: 'Verify data',
      enterPassphrase: 'Enter passphrase',
      enterPin: 'Enter the PIN and tap any card',
      tapCard: 'Tap any card',
    },
  },
  portfolio: {
    title: 'Portfolio',
    tokenTable: {
      title: 'Tokens',
      tableHeader: {
        token: 'Tokens',
        amount: 'Amount',
        value: 'Value',
      },
    },
    assetAllocation: {
      title: 'Asset Allocation',
      accountTitle: 'Accounts',
      tableHeader: {
        asset: 'Asset',
        account: 'Account',
        wallet: 'Wallet',
        price: 'Price',
        balance: 'Balance',
        value: 'Value',
        allocation: 'Allocation',
      },
    },
    walletMissing: {
      text: 'Wallets Missing',
      subText: 'Create a new wallet or import from seed phrase to get started',
      subText2:
        'If you have already created wallets in the device, simply sync them with cySync',
    },
    accountMissing: {
      text: 'Accounts Missing',
      subText: 'Create or import an account to get started',
    },
  },
  wallet: {
    title: 'Wallets',
    tableTitle: 'Accounts',
    buttons: {
      less: 'Show Less',
      more: 'Show More',
      hide: 'Hide Tokens',
      show: 'Show Tokens',
    },
    tableHeader: {
      account: 'Account',
      syncStatus: 'Sync Status',
      balance: 'Balance',
      value: 'Value',
    },
    accountMissing: {
      text: 'No Account yet',
      subText: 'No coins/accounts were found in the wallet',
    },
    search: {
      placeholder: 'Search',
      text: 'No results found for',
      subText: 'Please try searching another keywords',
    },
  },
  deleteAccount: {
    title: 'Are you sure you want to remove',
    subTitle:
      'You can add the account again from the ${walletName} wallet page. Note that this will not result in loss of assets',
    tokenSubtitle:
      'You can add the token again from the ${walletName} wallet page. Note that this will not result in loss of assets',
    buttons: {
      yes: 'Yes',
      no: 'No',
    },
  },
  errors: {
    deviceErrors,
    databaseError,
    serverErrors,
    default: 'Some internal error occurred',
  },
  validation: {
    generic: {
      required: 'This field is required',
    },
    email: {
      invalid: 'This is not a valid email',
    },
    password: {
      mismatch: 'Passwords do not match',
      passwordFieldPrefix: 'Password ',
      confirmPasswordFieldPrefix: 'Confirm Password ',
      minLength: 'must be at least 8 characters',
      containNumber: 'must contain at least 1 number',
      containSymbol: 'must contain at least 1 symbol',
      required: 'is required',
      containUppercase: 'must contain at least 1 uppercase letter',
      containLowercase: 'must contain at least 1 lowercase letter',
    },
  },
  guidedFlows: {
    createWallet: {
      title: 'Create New Wallet',
      tabs: [
        {
          asideTitle: 'X1 Vault',
          pages: [
            {
              title:
                'From the Main Menu of your X1 Vault, click on "Create Wallet"',
            },
            {
              title: 'Click "Generate New Wallet" on your X1 Vault',
            },
            {
              title: 'Enter a wallet name on your X1 Vault',
              bulletList: [
                'Upto 15 characters allowed',
                'It can be alphanumeric',
              ],
              messageBoxList: [
                {
                  info: 'Make sure that the wallet name is unique to other wallet names on the device',
                },
                {
                  warning:
                    'Wallet name once set cannot be modified. Please set the name accordingly',
                },
              ],
            },
            {
              title: 'Confirm the wallet name on the X1 Vault',
            },
            {
              title: 'Do you want to setup a PIN for your wallet?',
              messageBoxList: [
                {
                  warning:
                    'The PIN once set cannot be changed. You will have to delete the wallet and create again in order to change the PIN',
                },
              ],
            },
            {
              title: 'Setup a PIN on the X1 Vault',
              bulletList: [
                'Use between 4 and 8 characters',
                'The PIN can be alphanumeric',
              ],
              messageBoxList: [
                {
                  warning:
                    'Make sure you make a backup of your PIN. If you lose it , you lose access to your funds',
                },
                {
                  'warning-white':
                    'Skip this step if you are not setting up a PIN',
                },
              ],
            },
            {
              title: 'Confirm the entered PIN on the X1 Vault',
              messageBoxList: [
                {
                  warning:
                    "Remember your PIN, if you lose it, you lose access to your funds. Even Cypherock won't be able to help you recover your assets",
                },
                {
                  warning: 'Back it up in a safe place',
                },
                {
                  'warning-white':
                    'Skip this step if you are not setting up a PIN',
                },
              ],
            },
          ],
        },
        {
          asideTitle: 'Sync X1 Cards',
          pages: [
            {
              title: 'Tap X1 Cards one by one below the X1 Vault',
              subtitle: 'Do not lift until you hear a beep sound',
              messageBoxList: [
                {
                  info: 'Make sure your X1 Cards belong to the same family',
                },
                {
                  info: 'Make sure you tap the X1 Cards in the correct order',
                },
              ],
            },
          ],
        },
        {
          asideTitle: 'Confirmation',
          pages: [
            {
              title: 'Congratulations, your wallet is now successfully created',
            },
            {
              title:
                'The next time you need to make a transaction, you just need to fetch any one X1 Card along with the X1 Vault',
            },

            {
              title:
                'In case you lose your X1 Vault, you can buy a new X1 Vault separately and use it with your old X1 Cards',
            },
            {
              title: 'Important Note',
              messageBoxList: [
                {
                  warning:
                    'In case you need to add another wallet, you will need to fetch all of the 4 cards together. In case you want to import your other wallets into Cypherock X1, now is the best time to avoid the future hassle',
                },
              ],
            },
            {
              title:
                'As a next step, keep your X1 Cards safely inside the card sleeves and distribute them into different places. Some examples of the places could be: ',
              bulletList: [
                'Homes of your family members or your friends',
                'Secret hideout',
                'Bank locker',
              ],
            },
          ],
        },
      ],
    },
    importWallet: {
      title: 'Import Wallet',
      tabs: [
        {
          asideTitle: 'X1 Vault',
          pages: [
            {
              title:
                'From the Main Menu of your X1 Vault, click on "Create Wallet"',
            },
            {
              title: 'Click "Restore from Seed Phrase" on your X1 Vault',
            },
            {
              title: 'Enter a wallet name on your X1 Vault',
              bulletList: [
                'Upto 15 characters allowed',
                'It can be alphanumeric',
              ],
              messageBoxList: [
                {
                  info: 'Make sure that the wallet name is unique to other wallet names on the device',
                },
                {
                  warning:
                    'Wallet name once set cannot be modified. Please set the name accordingly',
                },
              ],
            },
            {
              title: 'Confirm the wallet name on the X1 Vault',
            },
            {
              title: 'Do you want to setup a PIN for your wallet?',
              messageBoxList: [
                {
                  warning:
                    'The PIN once set cannot be changed. You will have to delete the wallet and create again in order to change the PIN',
                },
              ],
            },
            {
              title: 'Setup a PIN on the X1 Vault',
              bulletList: [
                'Use between 4 and 8 characters',
                'The PIN can be alphanumeric',
              ],
              messageBoxList: [
                {
                  warning:
                    'Make sure you make a backup of your PIN. If you lose it , you lose access to your funds',
                },
                {
                  'warning-white':
                    'Skip this step if you are not setting up a PIN',
                },
              ],
            },
            {
              title: 'Confirm the entered PIN on the X1 Vault',
              messageBoxList: [
                {
                  warning:
                    "Remember your PIN, if you lose it, you lose access to your funds. Even Cypherock won't be able to help you recover your assets",
                },
                {
                  warning: 'Back it up in a safe place',
                },
                {
                  'warning-white':
                    'Skip this step if you are not setting up a PIN',
                },
              ],
            },
          ],
        },
        {
          asideTitle: 'Sync X1 Cards',
          pages: [
            {
              title:
                'Count the number of words of the seed phrase which you are importing and select it on the X1 Vault',
            },
            {
              title: 'Enter the seed phrase on the X1 Vault',
              messageBoxList: [
                {
                  warning:
                    'Make sure you do not make spelling mistakes while entering the words on the device. Words like "west" & "nest" are often confusing while reading and needs to be entered correctly',
                },
              ],
            },
            {
              title: 'Verify the seed phrase that you entered on the X1 Vault',
              subtitle:
                'Match each and every to successfully import the correct wallet',
            },
            {
              title: 'Tap X1 Cards one by one below the X1 Vault',
              subtitle: 'Do not lift until you hear a beep sound',
              messageBoxList: [
                {
                  info: 'Make sure your X1 Cards belong to the same family',
                },
                {
                  info: 'Make sure you tap the X1 Cards in the correct order',
                },
              ],
            },
          ],
        },
        {
          asideTitle: 'Confirmation',
          pages: [
            {
              title: 'Congratulations, your wallet is now successfully created',
            },
            {
              title:
                'The next time you need to make a transaction, you just need to fetch any one X1 Card along with the X1 Vault',
            },

            {
              title:
                'In case you lose your X1 Vault, you can buy a new X1 Vault separately and use it with your old X1 Cards',
            },
            {
              title: 'Important Note',
              messageBoxList: [
                {
                  warning:
                    'In case you need to add another wallet, you will need to fetch all of the 4 cards together. In case you want to import your other wallets into Cypherock X1, now is the best time to avoid the future hassle',
                },
              ],
            },
            {
              title:
                'As a next step, keep your X1 Cards safely inside the card sleeves and distribute them into different places. Some examples of the places could be: ',
              bulletList: [
                'Homes of your family members or your friends',
                'Secret hideout',
                'Bank locker',
              ],
            },
          ],
        },
      ],
    },
    finalMessage: {
      title:
        'To add coins and tokens in wallet, you have to add an account first. Make sure you have the X1 Vault and an X1 Card handy with you',
      buttons: {
        secondary: 'Skip',
        primary: 'Add Account',
      },
    },
    walletNotCreatedDialog: {
      title: "Seems like you haven't created a wallet yet",
      subtitle: 'To add an account you have to first create a wallet',
      buttons: {
        secondary: 'I will do it later',
        primary: 'Create Wallet',
      },
    },
    closeDialog: {
      title: 'Are you sure you want to exit?',
      subtitle:
        'You can always start this guide by clicking "Add Wallet" under the Wallets tab',
      buttons: {
        secondary: 'Cancel',
        primary: 'Exit',
      },
    },
  },
  dialogs: {
    close: {
      title: 'Are you sure you want to exit?',
    },
    reset: {
      confim: {
        title: 'Are you sure you want to reset the cySync app?',
        subTitle:
          'This will erase all your data on your cySync app. Note this will not result in loss of assets',
      },
    },
    releaseNote: {
      title: 'Release Notes',
    },
    auth: {
      title: 'Follow instructions on the X1 Vault',
      email2fa: {
        title:
          'You are recommended to enter an email ID as a 2FA to get authenticity results',
        emailInput: 'Email',
      },
      authX1Vault: {
        description: 'Your device is now being authenticated',
        info: 'Do not disconnect the device while it is being authenticated',
        steps: {
          confirm: 'Confirm authentication on device',
        },
        success: 'Your X1 Vault is authenticated successfully',
        authenticating: {
          title: 'Please wait while your X1 Vault is being authenticated',
          description:
            'Do not disconnect your X1 Vault while the operation is being done',
        },
      },
      authX1Card: {
        description: 'Your card is now being authenticated',
        info: 'Do not disconnect the device while card is being authenticated',
        steps: {
          confirm: 'Confirm card authentication on device',
          tapCard: 'Tap any card below the device',
        },
        success: 'Your X1 Card is authenticated successfully',
      },
    },
    password: {
      input: {
        enterPassword: 'Enter Password',
        oldPassword: 'Old Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
      },
      error: {
        mismatchError: 'Password Mismatched',
        lengthError: 'Password length should be more than 8',
        failedToSet: 'Failed to set Password',
      },
      success: {
        change: 'Password Changed Successfully',
        set: 'Password Set Successfully',
        remove: 'Password Removed Successfully',
      },
      info: {
        constraints:
          'Use 8 or more characters with a mix of letters, numbers & symbols',
      },
      confimPassword: {
        title: 'Confirm password to proceed',
        subTitle: 'Provide password to proceed',
      },
      createNewPassword: {
        title: 'Set your cySync password',
        subTitle: 'We do not store your password on our servers',
      },
    },
    contactSupport: {
      form: {
        header: 'Contact Support',
        title: 'How can we help?',
        description: 'Our team would love to hear from you',
        field: {
          email: {
            label: 'Email',
            placeholder: 'Your Email',
          },
          category: {
            label: 'Category',
            placeholder: 'Select Category',
          },
          description: {
            label: 'Description',
            placeholder: 'Describe your issue here',
          },
        },
        checks: {
          attachAppLogs: 'Attach Application Logs',
          attachDeviceLogs: 'Attach Device Logs',
          confirmDevice: 'Please confirm on device to proceed',
          fetchingDeviceLogs: 'Getting logs from device',
          attachedDeviceLogs: 'Device Logs Successfully Attached',
        },
        errors: {
          connectDevice: 'Connect the device to attach device logs',
          bootloaderMode: 'Device is in the bootloader mode',
        },
      },
      success: {
        formSubmit: 'Support Form Submitted Successfully',
      },
    },
    betaNotification: {
      title: 'CySync Update v2.0.0',
      description: `We have done a major overhaul to the CySync app.
The new CySync comes with all your favorite features and much more.
Download from <a href="https://cypherock.com/get-started">https://cypherock.com/get-started</a>

**Important**

* You won’t lose your funds
* After update, you will have to import your accounts again
* No new updates to CySync v1 except security update
`,
    },
  },
  toggle: {
    on: 'ON',
    off: 'OFF',
  },
  snackbar: {
    copiedToClipboard: 'Copied to clipboard',
  },
  settings: {
    tabs: {
      general: {
        title: 'General',
        item: {
          syncMobile: {
            title: 'Sync cySync Mobile App',
            description:
              'Sync your Accounts with cySync Mobile App through QR code',
          },
          editAccount: {
            title: 'Edit Accounts',
            description:
              'Edit the name, preferred currency of the account or remove them from portfolio',
          },
          toggleWalletOnPortfolio: {
            title: 'Show/Hide Wallets on the Portfolio',
            description:
              'You can disable a specific wallet from here. it will not be displayed on the portfolio page',
          },
          currency: {
            title: 'Preferred currency',
            description:
              'Choose the currency shown next to your balance and operations',
          },
          language: {
            title: 'Display Language',
            description: 'Set the language for the cySync App',
          },
          region: {
            title: 'Region',
            description:
              'Choose your region to update formats of date and time',
          },
        },
      },
      app: {
        title: 'App Settings',
        item: {
          password: {
            title: 'Password',
            description: 'Change or turn off/on password for your cySync App',
          },
          anayticsAndBugReport: {
            title: 'Analytics & Bug Report',
            description:
              'Enable analytics & bug reports to help Cypherock improve user experience & to help resolve your issues faster. This includes clicks, page visits, redirections, actions(send, receive, lock etc.), end of page scrolls, (un)installing and app version, number of accounts, crypto assets and operations, session durations, the Cypherock device type and firmware',
          },
          reset: {
            title: 'Reset cySync',
            description:
              'Erase all cysync data stored on your PC, including your accounts, transaction histories and settings. Note that this will not result in loss of assets',
          },
          update: {
            title: 'cySync Update',
            description: 'Automatically download cysync update when available',
          },
          usb: {
            title: 'USB Diagnostics',
            description: 'Troubleshoot USB connection with the device',
          },
        },
      },
      device: {
        title: 'Device Settings',
        item: {
          x1VaultAuth: {
            title: 'X1 Vault Authentication',
            description: 'Authenticate your device',
          },
          x1CardAuth: {
            title: 'X1 Card Authentication',
            description: 'Authenticate your card',
          },
          transferWallet: {
            title: 'Transfer Wallet',
            description:
              'If you ever had a Cypherock X1 and want to transfer your wallets using your cards in case you lost it or any reason whatsoever',
          },
        },
      },
      about: {
        title: 'About',
        item: {
          cySyncVersion: {
            title: 'cySync Version',
            description: 'Version ${version}',
          },
          termsOfUse: {
            title: 'Terms of Use',
            description: 'By using cySync you agree to our Terms of Use',
          },
          privacyPolicy: {
            title: 'Privacy Policy',
            description:
              'Refer to our Privacy Policy to learn what personal data we collect, why and how we use them',
          },
        },
      },
    },
  },
};

export type LanguageStrings = typeof en;

export default en;
