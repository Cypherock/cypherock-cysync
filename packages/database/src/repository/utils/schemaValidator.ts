import { z } from 'zod';

type datatype =
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'bigint'
  | 'function'
  | 'symbol'
  | 'array'
  | 'undefined';

interface Type {
  type: datatype;
  isOptional?: boolean;
}

export type ITableSchema<T> = Record<keyof T, Type>;

export function getValidatorSchema<Entity>(schema: ITableSchema<Entity>) {
  const shape: any = {};
  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const value = schema[key];
      let zType;
      switch (value.type) {
        case 'array':
          zType = z.any().array();
          break;
        case 'object':
          zType = z.object({}).passthrough();
          break;
        case 'string':
          zType = z.string();
          break;
        case 'symbol':
          zType = z.symbol();
          break;
        case 'undefined':
          zType = z.undefined();
          break;
        case 'function':
          zType = z.function();
          break;
        case 'bigint':
          zType = z.bigint();
          break;
        case 'number':
          zType = z.number();
          break;
        case 'boolean':
          zType = z.boolean();
          break;
        default:
          throw new Error('Unexpected type in schema');
          break;
      }
      if (value.isOptional) zType = zType.optional();
      shape[key] = zType;
    }
  }
  return z.object(shape);
}
