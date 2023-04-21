// to be imported from sdk
export type DeviceConnection = any;

// to be imported from database package
export type Database = any;

export type Account = any;

export class EvmSupport {
  private readonly db: Database;

  constructor(params: { db: Database }) {
    this.db = params.db;
  }

  public createAccounts(params: { connection: DeviceConnection }) {
    /**
     * Get all accounts
     * const accounts = this.db.getAccounts();
     *
     *
     *
     *
     */
  }
}
