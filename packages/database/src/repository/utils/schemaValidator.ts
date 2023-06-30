import { IEntity } from '@cypherock/db-interfaces';
import { z } from 'zod';

import { ITableSchema, typeMap } from './types';

import { BaseSchema } from '../../entity';

export function getValidators<Entity>(schema: ITableSchema<Entity>) {
  const shape: any = {};
  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const value = schema[key];
      let zType = typeMap[value.type].validator;
      if (value.isOptional) zType = zType.optional();
      shape[key] = zType;
    }
  }
  for (const key in BaseSchema) {
    if (Object.prototype.hasOwnProperty.call(BaseSchema, key)) {
      const value = BaseSchema[key as keyof IEntity];
      const zType = typeMap[value.type].validator.optional();
      shape[key] = zType;
    }
  }
  const schemaValidator = z.object(shape);
  const optionsValidator = z.object({
    sortBy: z
      .object({
        key: schemaValidator.keyof(),
        descending: z.boolean().optional(),
      })
      .optional(),
    limit: z.number().optional(),
  });
  return { schemaValidator, optionsValidator };
}
