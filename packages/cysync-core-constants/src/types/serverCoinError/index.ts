import { CoinFamily } from '@cypherock/coins';

import { LangErrors } from '../../i18n/types';
import { IErrorMsg } from '../deviceError';
import { ServerErrorDetails } from '../serverError';

// fill this variable as u define coin errors: ServerCoinErrorTypes = XrpErrorType | BtcErrorType | EvmErrorType
export type ServerCoinErrorTypes = 'unknown';

export type ServerCoinErrors = Partial<
  Record<CoinFamily, Record<ServerCoinErrorTypes, IErrorMsg>>
>;

export interface ServerCoinErrorParams {
  code: string;
  message: string;
  langError: LangErrors;
  coinFamily: CoinFamily;
  details?: ServerErrorDetails;
}

export class ServerCoinError extends Error {
  public readonly isServerCoinError = true;

  public code: string;

  public displayErrorMsg: IErrorMsg;

  public details?: ServerErrorDetails;

  constructor({
    code,
    message,
    langError,
    coinFamily,
    details,
  }: ServerCoinErrorParams) {
    super(message);
    this.code = code;
    this.details = details;

    const serverCoinErrors = langError.serverCoinErrors[coinFamily];
    const heading = serverCoinErrors
      ? serverCoinErrors[code as ServerCoinErrorTypes].heading
      : langError.defaultServerCoinErrors.heading;
    const subtext = serverCoinErrors
      ? serverCoinErrors[code as ServerCoinErrorTypes].subtext
      : langError.defaultServerCoinErrors.subtext;

    this.displayErrorMsg = { heading, subtext };
  }

  public toJSON() {
    return {
      isServerCoinError: this.isServerCoinError,
      code: this.code,
      message: `${this.code}: ${this.message}`,
      ...(this.details ?? {}),
      stack: this.stack,
    };
  }
}
