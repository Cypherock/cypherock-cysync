import { z } from 'zod';
import { ITableSchema, typeMap } from './types';

export function getValidatorSchema<Entity>(schema: ITableSchema<Entity>) {
  const shape: any = {};
  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const value = schema[key];
      let zType = typeMap[value.type].validator();
      if (value.isOptional) zType = zType.optional();
      shape[key] = zType;
    }
  }
  return z.object(shape);
}
