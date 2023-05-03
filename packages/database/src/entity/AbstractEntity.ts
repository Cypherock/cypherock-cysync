import { IEntity } from '@cypherock/db-interfaces';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity implements IEntity {
  @PrimaryGeneratedColumn()
  __id: string;

  @Column()
  __version: number;
}
