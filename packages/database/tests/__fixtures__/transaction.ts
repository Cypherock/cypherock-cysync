import {
  IDatabase,
  ITransaction,
  ITransactionRepository,
} from '@cypherock/db-interfaces';
import { ITestClass } from './types';

class TransactionData implements ITestClass<ITransaction> {
  name = 'Transaction';

  repo: ITransactionRepository;

  onlyRequired: ITransaction[] = [
    {
      hash: 'hash',
      fees: '0.002',
      amount: '1',
      status: 'failed',
      type: 'receive',
      timestamp: 1234,
      blockHeight: 20934,
      inputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      outputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      accountId: 'account1',
      assetId: 'asset1',
      familyId: 'family1',
      walletId: 'wallet1',
    },
    {
      hash: 'hash',
      fees: '0.002',
      amount: '1',
      status: 'failed',
      type: 'receive',
      timestamp: 1234,
      blockHeight: 20934,
      inputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      outputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      accountId: 'account1',
      assetId: 'asset1',
      familyId: 'family1',
      walletId: 'wallet1',
    },
    {
      hash: 'hash',
      fees: '0.002',
      amount: '1',
      status: 'failed',
      type: 'receive',
      timestamp: 1234,
      blockHeight: 20934,
      inputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      outputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      accountId: 'account1',
      assetId: 'asset1',
      familyId: 'family1',
      walletId: 'wallet1',
    },
    {
      hash: 'hash',
      fees: '0.002',
      amount: '1',
      status: 'failed',
      type: 'receive',
      timestamp: 1234,
      blockHeight: 20934,
      inputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      outputs: [{ address: 'address1', amount: 'amount1', isMine: false }],
      accountId: 'account1',
      assetId: 'asset1',
      familyId: 'family1',
      walletId: 'wallet1',
    },
  ];

  partial = [];

  all: ITransaction[] = [
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
  ];

  invalid: ITransaction[] = [
    {
      hash: 480 as any,
      fees: null as any,
      amount: 2 as any,
      status: null as any,
      type: [] as any,
      timestamp: '34' as any,
      blockHeight: '34309' as any,
      inputs: 59 as any,
      outputs: 'random' as any,
      confirmations: null as any,
      extraData: 34 as any,
      accountId: 0 as any,
      assetId: null as any,
      walletId: undefined as any,
      familyId: [] as any,
      parentTransactionId: {} as any,
      parentAccountId: 0 as any,
      parentAssetId: 90 as any,
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: null as any,
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: 2 as any,
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: null as any,
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: [] as any,
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: '34' as any,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: '34309' as any,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: 59 as any,
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: 'random' as any,
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: null as any,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: 34 as any,
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: 0 as any,
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: null as any,
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: undefined as any,
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: [] as any,
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: {} as any,
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: 0 as any,
      parentAssetId: '8e051490-ba72-49e7-a77f-4f601f7165f7',
    },
    {
      hash: '0xdc6c72433a898aaf5a808efcd376527d5d07613587a21fe9f59866f7e6b277ac',
      fees: '0.00503734101166152',
      amount: '0',
      status: 'success',
      type: 'receive',
      timestamp: 12342134,
      blockHeight: 237,
      inputs: [
        {
          address: '0xdb352c27f213940bf6f61bccd5e3866a5b05f6a4',
          amount: '0',
          isMine: false,
        },
      ],
      outputs: [
        {
          address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
          amount: '0',
          isMine: false,
        },
      ],
      confirmations: 1,
      extraData: {},
      accountId: '8e051491-b372-49e7-7483-4f601f71832a',
      assetId: '8e051491-b372-49e7-7483-4f601f71832a',
      walletId: '8e051491-b372-49e7-7483-4f601f71832a',
      familyId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentTransactionId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAccountId: '8e051491-b372-49e7-7483-4f601f71832a',
      parentAssetId: 90 as any,
    },
  ];

  setRepository(db: IDatabase) {
    this.repo = db.transaction;
  }
}
export const transactionData = new TransactionData();
