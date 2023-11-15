import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Observer } from 'rxjs';
import * as ethers from 'ethers';

import * as evmAppMock from './__mocks__/evmApp';
import * as serviceMock from './__mocks__/services';

import { EvmSupport, IEvmReceiveEvent } from '../src';

describe('03. Receive', () => {
  let support: EvmSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getOneMock = jest.fn<() => Partial<IAccount>>().mockReturnValue({
    walletId: '00000000',
    assetId: 'ethereum',
    parentAssetId: 'ethereum',
    xpubOrAddress: '0xF45b75b2b30f6d0ebC8dbdd57985433463260140',
    derivationPath: `m/44'/60'/0'/0/0`,
  });

  beforeEach(() => {
    EvmSupport.setEthersLibrary(ethers);
    support = new EvmSupport();
    connection = {} as any;
    db = {
      account: {
        getOne: getOneMock,
      },
    } as any;

    evmAppMock.create.mockClear();
    evmAppMock.getPublicKeys.mockClear();

    serviceMock.getBalance.mockClear();
    serviceMock.getTransactionCount.mockClear();

    getOneMock.mockClear();
  });

  test('should be able to verify receive address', done => {
    let isFlowCompleted = false;
    let generatedAddress = '';
    let didAddressMatched = false;

    const observer: Observer<IEvmReceiveEvent> = {
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
