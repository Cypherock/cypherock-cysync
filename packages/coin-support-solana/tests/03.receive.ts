import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Observer } from 'rxjs';

import * as solanaAppMock from './__mocks__/solanaApp';

import { SolanaSupport, ISolanaReceiveEvent } from '../src';

describe('03. Receive', () => {
  let support: SolanaSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getOneMock = jest.fn<() => Partial<IAccount>>().mockReturnValue({
    walletId: '00000000',
    assetId: 'solana',
    xpubOrAddress: 'wRKLUHF4oyRLnFn1zaPwSZK9VDwb4ksY3hP4rToz51pq',
    derivationPath: `m/44'/397'/0'/0'/0'`,
  });

  beforeEach(() => {
    support = new SolanaSupport();
    connection = {} as any;
    db = {
      account: {
        getOne: getOneMock,
      },
    } as any;

    solanaAppMock.create.mockClear();
    solanaAppMock.getPublicKeys.mockClear();

    getOneMock.mockClear();
  });

  test('should be able to verify receive address', done => {
    let isFlowCompleted = false;
    let generatedAddress = '';
    let didAddressMatched = false;

    const observer: Observer<ISolanaReceiveEvent> = {
      next: data => {
        if (data.type === 'Address' && data.address) {
          generatedAddress = data.address;
        }

        if (data.type === 'AddressMatched' && data.didAddressMatched) {
          didAddressMatched = data.didAddressMatched;
        }

        if (data.type === 'Device' && data.device?.isDone) {
          isFlowCompleted = true;
        }
      },
      complete: () => {
        expect(isFlowCompleted).toEqual(true);

        expect(generatedAddress).toBeTruthy();

        expect(didAddressMatched).toBe(true);

        done();
      },
      error: err => {
        throw err;
      },
    };

    support
      .receive({
        connection,
        db,
        accountId: 'account1',
      })
      .subscribe(observer);
  });
});
