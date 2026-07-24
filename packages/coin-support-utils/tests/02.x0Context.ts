import { IX0Session, X0FlowEvent } from '@cypherock/coin-support-interfaces';
import { Subscriber } from 'rxjs';

import {
  assertX0WalletId,
  createX0EventEmitter,
  resolveExecutionContext,
} from '../src/x0';

const fakeConnection: any = { isConnected: async () => true };

const fakeX0Session: IX0Session = {
  walletId: 'AB12',
  runTap: async op => op(undefined as any),
  abort: async () => undefined,
};

describe('resolveExecutionContext', () => {
  test('resolves x1 when only connection is given', () => {
    const context = resolveExecutionContext({ connection: fakeConnection });
    expect(context.type).toEqual('x1');
  });

  test('resolves x0 when only x0 is given', () => {
    const context = resolveExecutionContext({ x0: fakeX0Session });
    expect(context).toEqual({ type: 'x0', x0: fakeX0Session });
  });

  test('throws when both are given', () => {
    expect(() =>
      resolveExecutionContext({ connection: fakeConnection, x0: fakeX0Session }),
    ).toThrow('not both');
  });

  test('throws when neither is given', () => {
    expect(() => resolveExecutionContext({})).toThrow('required');
  });
});

describe('assertX0WalletId', () => {
  test('accepts a case-insensitive match', () => {
    expect(() => assertX0WalletId(fakeX0Session, 'ab12')).not.toThrow();
  });

  test('rejects a different wallet', () => {
    expect(() => assertX0WalletId(fakeX0Session, 'cd34')).toThrow(
      'different wallet',
    );
  });
});

describe('createX0EventEmitter', () => {
  enum FakeDeviceEvent {
    INIT = 0,
    CARD_TAPPED = 3,
  }

  test('maps flow events onto device-event enums and marks done', () => {
    const next = jest.fn();
    const observer = { next } as unknown as Subscriber<unknown>;

    const { onEvent, markDone } = createX0EventEmitter(observer, {
      [X0FlowEvent.INIT]: FakeDeviceEvent.INIT,
      [X0FlowEvent.CARD_CONNECTED]: FakeDeviceEvent.CARD_TAPPED,
    });

    onEvent(X0FlowEvent.INIT);
    onEvent(X0FlowEvent.CARD_CONNECTED);
    // PIN_VERIFIED is unmapped and must not emit
    onEvent(X0FlowEvent.PIN_VERIFIED);
    markDone();

    expect(next).toHaveBeenCalledTimes(3);
    expect(next.mock.calls[0][0]).toEqual({
      type: 'Device',
      device: { isDone: false, events: { [FakeDeviceEvent.INIT]: true } },
    });
    expect(next.mock.calls[2][0]).toEqual({
      type: 'Device',
      device: {
        isDone: true,
        events: {
          [FakeDeviceEvent.INIT]: true,
          [FakeDeviceEvent.CARD_TAPPED]: true,
        },
      },
    });
  });
});
