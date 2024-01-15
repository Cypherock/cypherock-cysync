import type { IEntity, IRepository } from './base';

export interface IMigration extends IEntity {
  id: string;
  ranAt: number;
  isSuccessful: boolean;
}

export type IMigrationRepository = IRepository<IMigration>;
