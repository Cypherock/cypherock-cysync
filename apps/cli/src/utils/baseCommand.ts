// eslint-disable-next-line max-classes-per-file
import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { NearSupport } from '@cypherock/coin-support-near';
import { SolanaSupport } from '@cypherock/coin-support-solana';
import { IDatabase, IKeyValueStore } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Command, Flags, Interfaces } from '@oclif/core';
import * as solanaWeb3 from '@solana/web3.js';
import * as bitcoin from 'bitcoinjs-lib';
import * as eip712 from 'eip-712';
import { ethers } from 'ethers';
import * as nearApiJs from 'near-api-js';
import * as starknetApiJs from 'starknet';

import { initializeAndGetDb } from './db';
import { cleanUpDeviceConnection, createConnection } from './device';
import { StarknetSupport } from '@cypherock/coin-support-starknet';

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof BaseCommand)['baseFlags'] & T['flags']
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {};

  protected connectToDevice = false;

  protected connectToDatabase = false;

  protected flags!: Flags<T>;

  protected args!: Args<T>;

  private connectionInstance: IDeviceConnection | undefined;

  private dbInstance: IDatabase | undefined;

  private keyDbInstance: IKeyValueStore | undefined;

  protected get connection(): IDeviceConnection {
    if (!this.connectionInstance) {
      throw new Error('No device connection found');
    }

    return this.connectionInstance;
  }

  protected set connection(instance: IDeviceConnection) {
    this.connectionInstance = instance;
  }

  protected get db(): IDatabase {
    if (!this.dbInstance) {
      throw new Error('No database connection found');
    }

    return this.dbInstance;
  }

  protected get keyDb(): IKeyValueStore {
    if (!this.keyDbInstance) {
      throw new Error('No key database connection found');
    }

    return this.keyDbInstance;
  }

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;

    if (this.connectToDevice) {
      this.connection = await createConnection();
    }

    if (this.connectToDatabase) {
      const createdDb = await initializeAndGetDb(this.config.dataDir);
      this.dbInstance = createdDb.db;
      this.keyDbInstance = createdDb.keyDb;

      await this.dbInstance.load();
    }

    BtcSupport.setBitcoinLibrary(bitcoin);
    EvmSupport.setEthersLibrary(ethers);
    EvmSupport.setEip712Library(eip712);
    NearSupport.setNearApiJs(nearApiJs);
    SolanaSupport.setWeb3Library(solanaWeb3);
    StarknetSupport.setStarknetApiJs(starknetApiJs);
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    if ((err as any)?.toJSON) {
      console.log((err as any).toJSON());
    } else {
      console.log(err);
    }
    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    await cleanUpDeviceConnection();
    await this.dbInstance?.close();
    await this.keyDbInstance?.close();
    return super.finally(_);
  }
}
