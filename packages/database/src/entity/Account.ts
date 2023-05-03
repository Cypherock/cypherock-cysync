/* eslint-disable no-use-before-define */
import {
  Entity,
  Column,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { IAccount } from '@cypherock/db-interfaces';
import { AbstractEntity } from './AbstractEntity';
import type { Wallet } from './Wallet';

@Entity()
@Tree('closure-table')
export class Account
  extends AbstractEntity
  implements Omit<IAccount, 'walletId' | 'parentAccountId'>
{
  @Column()
  name: string;

  @Column()
  xpubOrAddress: string;

  @Column()
  balance: string;

  @Column()
  unit: string;

  @Column()
  derivationPath: string;

  @Column()
  type: string;

  @Column('simple-json')
  extraData?: any | undefined;

  @Column()
  assetId: string;

  @TreeChildren()
  children: Account[];

  @TreeParent()
  parent: Account;

  @ManyToOne('Wallet', 'accounts')
  wallet: Wallet;
}
