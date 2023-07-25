import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { Observable } from 'rxjs';

import { App, IReceiveObservableParams } from './types';

export function ReceiveObservable<T extends App, K extends IReceiveEvent>(
  params: IReceiveObservableParams<T, K>,
) {
  return new Observable<K>(observer => {
    let finished = false;
    let app: T | undefined;

    const cleanUp = () => {
      if (app) {
        app.destroy();

        // TODO: Add this in SDK
        // app.abort();
      }
    };

    const unsubscribe = () => {
      finished = true;
      cleanUp();
    };

    const main = async () => {
      try {
        if (finished) return;

        app = await params.createApp(params.connection);
        const { address, expectedFromDevice, derivationPath } =
          await params.generateReceiveAddress({
            accountId: params.accountId,
            db: params.db,
          });
        observer.next({ type: 'Address', address } as any);

        if (finished) return;

        const addressFromDevice = await params.getReceiveAddressFromDevice({
          app,
          derivationPath,
          walletId: params.walletId,
          observer,
        });
        observer.next({
          type: 'AddressMatched',
          addressMatched: addressFromDevice === expectedFromDevice,
        } as any);

        observer.complete();
      } catch (error) {
        if (!finished) {
          observer.error(error);
        }
      }
    };

    main();

    return unsubscribe;
  });
}
