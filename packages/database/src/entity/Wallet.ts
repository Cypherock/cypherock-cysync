import { IWallet } from '@cypherock/db-interfaces';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import type { Device } from './Device';
import type { Account } from './Account';

@Entity()
export class Wallet extends AbstractEntity implements IWallet {
  deviceId: string;

  @Column()
  name: string;

  @Column()
  hasPin: boolean;

  @Column()
  hasPassphrase: boolean;

  @ManyToOne('Device', 'wallets')
  device: Device;

  @OneToMany('Account', 'wallet')
  accounts: Account[];
}
