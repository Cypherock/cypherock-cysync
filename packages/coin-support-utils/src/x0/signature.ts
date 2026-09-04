import { secp256k1 } from '@noble/curves/secp256k1';

const numberTo32Bytes = (value: bigint): Uint8Array => {
  const hex = value.toString(16).padStart(64, '0');
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const equalBytes = (a: Uint8Array, b: Uint8Array): boolean =>
  a.length === b.length && a.every((byte, i) => byte === b[i]);

export function derToRS(der: Uint8Array): { r: Uint8Array; s: Uint8Array } {
  const signature = secp256k1.Signature.fromDER(der);
  return { r: numberTo32Bytes(signature.r), s: numberTo32Bytes(signature.s) };
}

export function derToCompact(der: Uint8Array): Uint8Array {
  return secp256k1.Signature.fromDER(der).toCompactRawBytes();
}

export function compressPublicKey(publicKey: Uint8Array): Uint8Array {
  return secp256k1.ProjectivePoint.fromHex(publicKey).toRawBytes(true);
}

export function decompressPublicKey(publicKey: Uint8Array): Uint8Array {
  return secp256k1.ProjectivePoint.fromHex(publicKey).toRawBytes(false);
}

/**
 * Every X0 signature MUST be verified before use — the card SDK does not
 * verify on the host's behalf.
 */
export function verifyDerSignature(
  digest: Uint8Array,
  der: Uint8Array,
  publicKey: Uint8Array,
): boolean {
  try {
    return secp256k1.verify(
      secp256k1.Signature.fromDER(der),
      digest,
      publicKey,
      { prehash: false },
    );
  } catch (error) {
    return false;
  }
}

/**
 * DER signatures carry no recovery id; recover it by trial against the
 * known signer public key (needed for EVM/Tron `v`).
 */
export function recoverRecid(
  digest: Uint8Array,
  der: Uint8Array,
  expectedPublicKey: Uint8Array,
): 0 | 1 {
  const signature = secp256k1.Signature.fromDER(der);
  const expected = compressPublicKey(expectedPublicKey);

  for (const recovery of [0, 1] as const) {
    const recovered = signature
      .addRecoveryBit(recovery)
      .recoverPublicKey(digest)
      .toRawBytes(true);
    if (equalBytes(recovered, expected)) return recovery;
  }

  throw new Error('Signature does not match the expected public key');
}
