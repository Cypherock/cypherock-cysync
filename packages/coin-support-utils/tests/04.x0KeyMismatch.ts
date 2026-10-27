import { IReceiveEvent, IX0Session } from '@cypherock/coin-support-interfaces';

import { makeReceiveObservable } from '../src/receive';
import { X0KeyMismatchError } from '../src/x0';

const WALLET_ID = 'ab12';
const EXPECTED_ADDRESS = 'expected-address';

const x0Session: IX0Session = {
  walletId: WALLET_ID,
  runTap: async op => op(undefined as any),
  abort: async () => undefined,
};

const receiveWithCardAddress = (addressFromCard: string) =>
  new Promise<IReceiveEvent[]>((resolve, reject) => {
    const events: IReceiveEvent[] = [];
    makeReceiveObservable<any, IReceiveEvent>({
      db: {
        account: {
          getOne: async () => ({ __id: 'account-1', walletId: WALLET_ID }),
        },
      } as any,
      accountId: 'account-1',
      x0: x0Session,
      createApp: async () => ({ abort: async () => undefined }),
      generateReceiveAddress: async () => ({
        address: EXPECTED_ADDRESS,
        expectedFromDevice: EXPECTED_ADDRESS,
        derivationPath: "m/44'/60'/0'/0/0",
      }),
      getReceiveAddressFromDevice: async () => EXPECTED_ADDRESS,
      getReceiveAddressFromX0: async () => addressFromCard,
    }).subscribe({
      next: event => events.push(event),
      complete: () => resolve(events),
      error: reject,
    });
  });

describe('X0KeyMismatchError', () => {
  test('carries a flag that survives the ES5 build', () => {
    const error = new X0KeyMismatchError();
    expect(error.isX0KeyMismatchError).toBe(true);
    expect(error.name).toEqual('X0KeyMismatchError');
    expect(error.message).toContain('different key');
  });
});

describe('X0 receive', () => {
  test('reports a match when the card derives the expected address', async () => {
    const events = await receiveWithCardAddress(EXPECTED_ADDRESS);
    expect(events).toContainEqual({
      type: 'AddressMatched',
      didAddressMatched: true,
    });
  });

  test('fails with X0KeyMismatchError when the card derives another address', async () => {
    await expect(receiveWithCardAddress('other-address')).rejects.toMatchObject(
      { isX0KeyMismatchError: true },
    );
  });
});
