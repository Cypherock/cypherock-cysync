import {
  getExtendedKeyVersion,
  setExtendedKeyVersion,
} from '@cypherock/coin-support-utils';
import { BtcIdMap } from '@cypherock/coins';
import { getPurposeType } from '@cypherock/sdk-app-btc';

type PurposeType = ReturnType<typeof getPurposeType>;

/**
 * X1 firmware's account xpub version per coin and purpose (btc_app.c and its
 * ltc/doge/dash siblings). The backend derives the address type from it —
 * an `xpub` yields legacy addresses even for an m/84' key — so X0 accounts
 * must be stored exactly as X1 stores them.
 */
const ACCOUNT_XPUB_VERSIONS: Record<
  string,
  Partial<Record<PurposeType, number>>
> = {
  [BtcIdMap.bitcoin]: {
    legacy: 0x0488b21e,
    nested_segwit: 0x049d7cb2,
    segwit: 0x04b24746,
    taproot: 0x04b24746,
  },
  [BtcIdMap.litecoin]: { legacy: 0x019da462 },
  [BtcIdMap.dogecoin]: { legacy: 0x02facafd },
  [BtcIdMap.dash]: { legacy: 0x0488b21e },
};

const TAPROOT_DESCRIPTOR = /^tr\((.+)\)$/;

/**
 * Formats a card-derived account xpub the way X1 accounts store it: the
 * firmware's version word for the purpose, and taproot wrapped in a `tr()`
 * descriptor as sdk-app-btc's getXpubs does.
 */
export const toAccountXpub = (
  xpub: string,
  coinId: string,
  derivationPath: number[],
): string => {
  const purpose = getPurposeType(derivationPath);
  const version = ACCOUNT_XPUB_VERSIONS[coinId]?.[purpose];
  if (version === undefined) {
    throw new Error(`X0 does not support ${purpose} accounts for ${coinId}`);
  }

  const encoded = setExtendedKeyVersion(xpub, version);
  return purpose === 'taproot' ? `tr(${encoded})` : encoded;
};

/** The bare extended key and its version word from a stored account xpub. */
export const parseAccountXpub = (
  xpubOrAddress: string,
): { extendedKey: string; version: number } => {
  const extendedKey =
    TAPROOT_DESCRIPTOR.exec(xpubOrAddress)?.[1] ?? xpubOrAddress;
  return { extendedKey, version: getExtendedKeyVersion(extendedKey) };
};
