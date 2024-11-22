import { InheritanceApp } from '@cypherock/sdk-app-inheritance';
import { Observable } from 'rxjs';

import {
  IInheritanceStopSessionEvent,
  IInheritanceStopSessionParams,
} from './types';

import logger from '../../utils/logger';

export const stopSession = (
  params: IInheritanceStopSessionParams,
): Observable<IInheritanceStopSessionEvent> =>
  new Observable<IInheritanceStopSessionEvent>(observer => {
    let finished = false;
    let app: InheritanceApp | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting inheritance stop session');
          logger.warn(error);
        }
      }
    };

    const unsubscribe = () => {
      if (!finished) {
        finished = true;
        cleanUp();
      }
    };

    const main = async () => {
      try {
        const { connection } = params;
        app = await InheritanceApp.create(connection);

        await app.closeSession();
        observer.next({ type: 'Device', device: { isDone: true } });
        observer.next({
          type: 'Result',
        });

        finished = true;
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
