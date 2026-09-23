import { IX0Session } from '@cypherock/coin-support-interfaces';
import { assert } from '@cypherock/cysync-utils';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export type IDeviceExecutionContext =
  | { type: 'x1'; connection: IDeviceConnection }
  | { type: 'x0'; x0: IX0Session };

/**
 * Normalizes the optional `connection` (X1) / `x0` (X0) params into a
 * discriminated union. Flows that need a signer call this and branch once.
 */
export function resolveExecutionContext(params: {
  connection?: IDeviceConnection;
  x0?: IX0Session;
}): IDeviceExecutionContext {
  if (params.connection && params.x0) {
    throw new Error('Provide either connection (X1) or x0 (X0) but not both');
  }

  if (params.x0) return { type: 'x0', x0: params.x0 };
  if (params.connection) return { type: 'x1', connection: params.connection };

  throw new Error('Either connection (X1) or x0 (X0) is required');
}

export function assertX0WalletId(x0: IX0Session, walletId: string): void {
  assert(
    x0.walletId.toLowerCase() === walletId.toLowerCase(),
    'X0 session is bound to a different wallet than the requested operation',
  );
}
