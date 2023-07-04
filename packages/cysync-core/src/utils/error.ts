import { ILangState } from '~/store';

export interface IParsedError {
  msg: string;
  showRetry: boolean;
  showSupport: boolean;
}

export const getParsedError = (params: {
  error: any;
  defaultMsg?: string;
  lang: ILangState;
}): IParsedError => {
  const { error, lang } = params;

  let msg = params.defaultMsg ?? lang.strings.errors.default;

  if (error && error.isDeviceError && error.code) {
    msg = (lang.strings.errors.deviceErrors as any)[error.code] ?? msg;
  }

  return { msg, showRetry: true, showSupport: true };
};
