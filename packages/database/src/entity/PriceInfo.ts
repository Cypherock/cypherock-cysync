import { IPriceInfo } from '@cypherock/db-interfaces';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import type { PriceHistory } from './PriceHistory';

@Entity()
export class PriceInfo extends AbstractEntity implements IPriceInfo {
  @Column()
  currency: string;

  @Column()
  latestPrice: string;

  @Column()
  assetId: string;

  @OneToMany('PriceHistory', 'priceInfo')
  priceHistories: PriceHistory[];
}
