import { IDevice } from '@cypherock/db-interfaces';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import type { Wallet } from './Wallet';

@Entity()
export class Device extends AbstractEntity implements IDevice {
  @Column()
  serial: string;

  @Column()
  version: string;

  @Column()
  isAuthenticated: boolean;

  @OneToMany('Wallet', 'device')
  wallets: Wallet[];
}
