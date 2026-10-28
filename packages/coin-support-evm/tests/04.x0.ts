import { Observer } from 'rxjs';
import {
  IReceiveEvent,
  IX0Session,
  SignMessageType,
} from '@cypherock/coin-support-interfaces';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as ethers from 'ethers';

import * as serviceMock from './__mocks__/services';
import {
  createMockX0Session,
  getMockPublicKey,
  IMockX0SessionOptions,
  MOCK_WALLET_ID,
} from './__mocks__/x0Session';

import {
  EvmSupport,
  ICreateEvmAccountEvent,
  IEvmAccount,
  ISignEvmTransactionEvent,
} from '../src';
import { X0_DERIVATION_PATH_LIMIT } from '../src/operations/createAccounts/x0';

const createPathCountingX0Session = (derivedPaths: number[][]): IX0Session => {
  const session = createMockX0Session();
  return {
    ...session,
    runTap: (op, hooks) =>
      session.runTap(
        card =>
          op({
            ...card,
            deriveKeys: params => {
              derivedPaths.push(...params.paths);
              return card.deriveKeys(params);
            },
          }),
        hooks,
      ),
  };
};

const pathToNumbers = (path: string): number[] =>
  path
    .replace('m/', '')
    .split('/')
    .map(part =>
      part.endsWith("'")
        ? parseInt(part.slice(0, -1), 10) + 0x80000000
        : parseInt(part, 10),
    );

const addressAtPath = (path: string): string =>
  ethers.computeAddress(
    `0x${Buffer.from(getMockPublicKey(pathToNumbers(path))).toString('hex')}`,
  );

const makeAccount = (): IAccount => ({
  name: 'Ethereum 1',
  xpubOrAddress: addressAtPath("m/44'/60'/0'/0/0"),
  balance: '0',
  unit: 'ETH',
  derivationPath: "m/44'/60'/0'/0/0",
  type: 'account' as any,
  familyId: 'evm',
  assetId: 'ethereum',
  parentAssetId: 'ethereum',
  walletId: MOCK_WALLET_ID,
  derivationScheme: 'metamask',
  isHidden: false,
  extraData: {},
});

const makeTransaction = (): any => ({
  accountId: 'account-1',
  validation: {
    outputs: [true],
    hasEnoughBalance: true,
    isValidFee: true,
    ownOutputAddressNotAllowed: [false],
    zeroAmountNotAllowed: false,
  },
  userInputs: { outputs: [], isSendAll: false, nonce: '0' },
  staticData: { averageGasPrice: '1000000000' },
  computedData: {
    output: {
      address: '0x2A30C64F04e27A0d9fc7dBd749fa5a2B8E1FC77A',
      amount: '10000000000000',
    },
    data: '0x',
    fee: '21000000000000',
    gasPrice: '1000000000',
    gasLimit: '21000',
    gasLimitEstimate: '21000',
    l1Fee: '0',
  },
});

const createSignObservingX0Session = (
  onSignHashes: () => void,
  options?: IMockX0SessionOptions,
): IX0Session => {
  const session = createMockX0Session(MOCK_WALLET_ID, options);
  return {
    ...session,
    runTap: (op, hooks) =>
      session.runTap(
        card =>
          op({
            ...card,
            signHashes: params => {
              onSignHashes();
              return card.signHashes(params);
            },
          }),
        hooks,
      ),
  };
};

const typedDataDomain = {
  name: 'X0 Test',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
};

const typedDataTypes = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person[]' },
    { name: 'contents', type: 'string' },
  ],
};

const alice = {
  name: 'Alice',
  wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
};
const bob = {
  name: 'Bob',
  wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
};

describe('04. X0 flows', () => {
  let support: EvmSupport;
  let db: IDatabase;
  const getAllMock = jest.fn().mockReturnValue([]);
  const getOneMock = jest.fn();

  beforeEach(() => {
    EvmSupport.setEthersLibrary(ethers);
    support = new EvmSupport();
    db = {
      account: {
        getAll: getAllMock,
        getOne: getOneMock,
      },
    } as any;

    serviceMock.getBalance.mockClear();
    serviceMock.getTransactionCount.mockClear();
    getAllMock.mockClear();
    getAllMock.mockReturnValue([]);
    getOneMock.mockReset();
  });

  test('createAccounts derives addresses on the card and skips the legacy scheme', done => {
    const accounts: IEvmAccount[] = [];
    let isDeviceDone = false;

    const observer: Observer<ICreateEvmAccountEvent> = {
      next: data => {
        if (data.type === 'Account' && data.account) {
          accounts.push(data.account);
        }
        if (data.type === 'Device' && data.device?.isDone) {
          isDeviceDone = true;
        }
      },
      complete: () => {
        expect(isDeviceDone).toEqual(true);
        expect(accounts.length).toEqual(2);

        expect(
          accounts.filter(e => e.derivationScheme === 'legacy'),
        ).toHaveLength(0);

        const ledger = accounts.find(e => e.derivationScheme === 'ledger');
        const metamask = accounts.find(e => e.derivationScheme === 'metamask');

        expect(ledger?.derivationPath).toEqual("m/44'/60'/0'/0/0");
        expect(ledger?.xpubOrAddress).toEqual(
          addressAtPath("m/44'/60'/0'/0/0"),
        );
        expect(metamask?.derivationPath).toEqual("m/44'/60'/0'/0/1");
        expect(metamask?.xpubOrAddress).toEqual(
          addressAtPath("m/44'/60'/0'/0/1"),
        );
        done();
      },
      error: err => {
        done(err);
      },
    };

    support
      .createAccounts({
        x0: createMockX0Session(),
        db,
        coinId: 'ethereum',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe(observer);
  }, 10000);

  test('createAccounts caps card derivations in one tap at the X0 path limit', done => {
    const derivedPaths: number[][] = [];

    support
      .createAccounts({
        x0: createPathCountingX0Session(derivedPaths),
        db,
        coinId: 'ethereum',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe({
        next: () => undefined,
        complete: () => {
          // The limit caps the whole tap, split across the ledger and
          // metamask schemes; both share m/44'/60'/0'/0/0 at index 0, which
          // is only derived once.
          expect(derivedPaths.length).toBeGreaterThan(0);
          expect(derivedPaths.length).toBeLessThanOrEqual(
            X0_DERIVATION_PATH_LIMIT,
          );
          done();
        },
        error: err => {
          done(err);
        },
      });
  }, 10000);

  test('createAccounts rejects a session bound to another wallet', done => {
    const derivedPaths: number[][] = [];
    const session = createPathCountingX0Session(derivedPaths);

    support
      .createAccounts({
        x0: { ...session, walletId: 'deadbeef' },
        db,
        coinId: 'ethereum',
        walletId: MOCK_WALLET_ID,
        waitInMSBetweenEachAccountAPI: 1,
      })
      .subscribe({
        next: () => undefined,
        complete: () => done(new Error('should have failed')),
        error: error => {
          expect(error.message).toContain('different wallet');
          expect(derivedPaths).toHaveLength(0);
          done();
        },
      });
  }, 10000);

  test('signTransaction produces a broadcastable EIP-155 transaction', done => {
    const account = makeAccount();
    const transaction = makeTransaction();

    let signed: string | undefined;

    const observer: Observer<ISignEvmTransactionEvent> = {
      next: data => {
        if (data.type === 'Transaction') signed = data.transaction;
      },
      complete: () => {
        expect(signed).toBeDefined();
        const parsed = ethers.Transaction.from(signed);
        expect(parsed.from).toEqual(account.xpubOrAddress);
        expect(parsed.to).toEqual(transaction.computedData.output.address);
        expect(parsed.chainId.toString()).toEqual('1');
        done();
      },
      error: err => {
        done(err);
      },
    };

    support
      .signTransaction({
        x0: createMockX0Session(),
        db,
        transaction,
        account,
      })
      .subscribe(observer);
  }, 10000);

  test('signTransaction rejects a session bound to another wallet', done => {
    const account = makeAccount();

    support
      .signTransaction({
        x0: createMockX0Session('deadbeef'),
        db,
        transaction: { accountId: 'account-1' } as any,
        account,
      })
      .subscribe({
        next: () => undefined,
        complete: () => done(new Error('should have failed')),
        error: error => {
          expect(error.message).toContain('different wallet');
          done();
        },
      });
  }, 10000);

  const signMessageWithX0 = (
    signingType: SignMessageType,
    message: string,
    x0: IX0Session = createMockX0Session(),
  ) =>
    new Promise<string | undefined>((resolve, reject) => {
      let signature: string | undefined;
      support
        .signMessage({
          x0,
          db,
          account: makeAccount(),
          payload: { signingType, message },
        })
        .subscribe({
          next: data => {
            if (data.type === 'Message') signature = data.signature;
          },
          complete: () => resolve(signature),
          error: reject,
        });
    });

  test('signMessage applies the EIP-191 prefix like X1 firmware', async () => {
    const message = '0xdeadbeef';
    const signature = await signMessageWithX0(
      SignMessageType.PRIVATE_MESSAGE,
      message,
    );
    expect(
      ethers.verifyMessage(ethers.getBytes(message), signature ?? ''),
    ).toEqual(makeAccount().xpubOrAddress);
  }, 10000);

  test('signMessage signs typed data carrying unused types', async () => {
    const payload = {
      domain: typedDataDomain,
      types: {
        ...typedDataTypes,
        Unused: [{ name: 'value', type: 'uint256' }],
      },
      primaryType: 'Mail',
      message: { from: alice, to: [bob], contents: 'Hello, Bob!' },
    };
    const signature = await signMessageWithX0(
      SignMessageType.TYPED_MESSAGE,
      JSON.stringify(payload),
    );
    const { Person, Mail } = typedDataTypes;
    expect(
      ethers.verifyTypedData(
        typedDataDomain,
        { Person, Mail },
        payload.message,
        signature ?? '',
      ),
    ).toEqual(makeAccount().xpubOrAddress);
  }, 10000);

  test('signMessage signs the struct named by primaryType', async () => {
    const payload = {
      domain: typedDataDomain,
      types: typedDataTypes,
      primaryType: 'Person',
      message: alice,
    };
    const signature = await signMessageWithX0(
      SignMessageType.TYPED_MESSAGE,
      JSON.stringify(payload),
    );
    expect(
      ethers.verifyTypedData(
        typedDataDomain,
        { Person: typedDataTypes.Person },
        alice,
        signature ?? '',
      ),
    ).toEqual(makeAccount().xpubOrAddress);
  }, 10000);

  test('signMessage rejects typed data without a known primaryType', async () => {
    const payload = {
      domain: typedDataDomain,
      types: typedDataTypes,
      primaryType: 'Missing',
      message: alice,
    };
    await expect(
      signMessageWithX0(SignMessageType.TYPED_MESSAGE, JSON.stringify(payload)),
    ).rejects.toThrow('primaryType');
  }, 10000);

  test('signTransaction stops before signing when the card derives another key', async () => {
    let signHashesCalls = 0;

    await expect(
      new Promise((resolve, reject) => {
        support
          .signTransaction({
            x0: createSignObservingX0Session(
              () => {
                signHashesCalls += 1;
              },
              { wrongPassphrase: true },
            ),
            db,
            transaction: makeTransaction(),
            account: makeAccount(),
          })
          .subscribe({ complete: () => resolve(undefined), error: reject });
      }),
    ).rejects.toMatchObject({ isX0KeyMismatchError: true });
    expect(signHashesCalls).toEqual(0);
  }, 10000);

  test('signMessage stops before signing when the card derives another key', async () => {
    let signHashesCalls = 0;

    await expect(
      signMessageWithX0(
        SignMessageType.PRIVATE_MESSAGE,
        '0xdeadbeef',
        createSignObservingX0Session(
          () => {
            signHashesCalls += 1;
          },
          { wrongPassphrase: true },
        ),
      ),
    ).rejects.toMatchObject({ isX0KeyMismatchError: true });
    expect(signHashesCalls).toEqual(0);
  }, 10000);

  test('receive fails with X0KeyMismatchError when the card derives another key', async () => {
    getOneMock.mockReturnValue(Promise.resolve(makeAccount()));

    await expect(
      new Promise((resolve, reject) => {
        support
          .receive({
            x0: createMockX0Session(MOCK_WALLET_ID, { wrongPassphrase: true }),
            db,
            accountId: 'account-1',
          })
          .subscribe({ complete: () => resolve(undefined), error: reject });
      }),
    ).rejects.toMatchObject({ isX0KeyMismatchError: true });
  }, 10000);

  test('receive verifies the address against the card', done => {
    const account = makeAccount();
    getOneMock.mockReturnValue(Promise.resolve(account));

    let address: string | undefined;
    let didAddressMatched: boolean | undefined;

    const observer: Observer<IReceiveEvent> = {
      next: data => {
        if (data.type === 'Address') address = data.address;
        if (data.type === 'AddressMatched') {
          didAddressMatched = data.didAddressMatched;
        }
      },
      complete: () => {
        expect(address).toEqual(account.xpubOrAddress);
        expect(didAddressMatched).toEqual(true);
        done();
      },
      error: err => {
        done(err);
      },
    };

    support
      .receive({
        x0: createMockX0Session(),
        db,
        accountId: 'account-1',
      })
      .subscribe(observer);
  }, 10000);
});
