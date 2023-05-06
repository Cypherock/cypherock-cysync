import {
  IPriceHistory,
  IPriceSnapshot,
} from '@cypherock/db-interfaces/dist/entities/priceHistory';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import type { PriceInfo } from './PriceInfo';

@Entity()
export class PriceHistory extends AbstractEntity implements IPriceHistory {
  priceInfoId: string;

  assetId: string;

  currency: string;

  @Column()
  days: number;

  @Column('simple-array')
  history: IPriceSnapshot[];

  @ManyToOne('PriceInfo', 'priceHistories')
  priceInfo: PriceInfo;
}
