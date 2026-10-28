/**
 * Structural (duck-typed) mirror of the X0 card SDK surface. This package
 * must NOT depend on `@cypherock/x0-card-sdk` — the app injects an adapter,
 * which also keeps wallet secrets (PIN, passphrase, host share) out of
 * coin-support entirely.
 */

export type X0KeyFormat = 'raw-pubkey' | 'xpub';

export interface IX0DeriveKeyResult {
  /** 33-byte compressed secp256k1 public key of the derived node. */
  publicKey: Uint8Array;
  /** `xpub` format only. */
  chainCode?: Uint8Array;
  /** `xpub` format only. */
  xpub?: string;
}

/**
 * `schnorr-bip340` signs under the BIP-341 key-path tweak of the leaf key
 * (empty merkle root), so it verifies against the taproot output key, not
 * the derived public key.
 */
export type X0SignatureScheme = 'ecdsa-der' | 'schnorr-bip340';

export interface IX0SignHashesResult {
  /**
   * `ecdsa-der`: DER-encoded low-S secp256k1 ECDSA signature.
   * `schnorr-bip340`: 64-byte BIP-340 signature (R.x ‖ s).
   */
  signature: Uint8Array;
}

/**
 * Card operations available inside ONE physical tap. Limits mirror the card:
 * deriveKeys ≤5 paths/call (`xpub` depth 3..5, `raw-pubkey` depth exactly 5);
 * signHashes ONE depth-5 leaf and 32-byte digests signed as-is (no
 * additional hashing on-card), 1..8 per call for `ecdsa-der` and 1..3 for
 * `schnorr-bip340`. `scheme` defaults to `ecdsa-der`.
 */
export interface IX0CardOperations {
  deriveKeys(params: {
    paths: number[][];
    format: X0KeyFormat;
    xpub?: { version?: number };
  }): Promise<IX0DeriveKeyResult[]>;
  signHashes(params: {
    path: number[];
    hashes: Uint8Array[];
    scheme?: X0SignatureScheme;
  }): Promise<IX0SignHashesResult[]>;
}

export enum X0FlowEvent {
  INIT = 0,
  CARD_CONNECTED = 1,
  PIN_VERIFIED = 2,
}

/**
 * Injected by the app. The adapter owns the NFC tap lifecycle, PIN/passphrase
 * prompting, and the wallet credential lookup. Coin-support batches all card
 * calls of a flow into as few runTap() invocations as possible — ideally one.
 */
export interface IX0Session {
  /** Hex wallet id this session is bound to; must match the flow's wallet. */
  readonly walletId: string;
  runTap<T>(
    op: (card: IX0CardOperations) => Promise<T>,
    hooks?: { onEvent?: (event: X0FlowEvent) => void },
  ): Promise<T>;
  /** Cancel a pending or active tap (called on observable unsubscribe). */
  abort(): Promise<void>;
}
