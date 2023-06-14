import { z } from 'zod';

export type datatype =
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'bigint'
  | 'array';

interface Type {
  type: datatype;
  isOptional?: boolean;
}

export type ITableSchema<T> = Record<keyof T, Type>;

interface ITypeParser {
  validator: Zod.ZodType;
}

export const typeMap: Record<datatype, ITypeParser> = {
  number: {
    validator: z.number(),
  },
  string: {
    validator: z.string(),
  },
  bigint: {
    validator: z.bigint(),
  },
  boolean: {
    validator: z.boolean(),
  },
  object: {
    validator: z.object({}),
  },
  array: {
    validator: z.any().array(),
  },
};
