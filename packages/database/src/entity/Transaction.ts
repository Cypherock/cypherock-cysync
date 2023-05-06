/* eslint-disable no-use-before-define */
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';
import {
  IAddressInfo,
  ITransaction,
  Status,
  TransactionType,
} from '@cypherock/db-interfaces';
import { AbstractEntity } from './AbstractEntity';

@Entity()
@Tree('closure-table')
export class Transaction extends AbstractEntity implements ITransaction {
  accountId: string;

  parentTransactionId?: string | undefined;

  @Column()
  hash: string;

  @Column()
  fees: string;

  @Column()
  amount: string;

  @Column()
  status: Status;

  @Column()
  type: TransactionType;

  @Column()
  timestamp: number;

  @Column()
  blockHeight: number;

  @Column('simple-array')
  inputs: IAddressInfo[];

  @Column('simple-array')
  outputs: IAddressInfo[];

  @Column()
  confirmations?: number;

  @Column('simple-json')
  extraData?: any | undefined;

  @TreeChildren()
  children: Transaction[];

  @TreeParent()
  parent: Transaction;
}
