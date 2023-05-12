import { z } from 'zod';

export type datatype =
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

type genericFunction = (obj?: any) => any;

interface ITypeParser {
  sqlColumnType: string;
  sqlSerializer: genericFunction;
  sqlDeserializer: genericFunction;
  validator: genericFunction;
}

const numeric = 'NUMERIC';
const text = 'TEXT';

const toString: genericFunction = value => value.toString();
const stringify: genericFunction = value => JSON.stringify(value);
const JSONparse: genericFunction = value => JSON.parse(value);
const unknown: genericFunction = () => undefined;
const noChange: genericFunction = value => value;

export const typeMap: Record<datatype, ITypeParser> = {
  number: {
    sqlColumnType: numeric,
    sqlSerializer: toString,
    sqlDeserializer: noChange,
    validator: z.number,
  },
  string: {
    sqlColumnType: text,
    sqlSerializer: toString,
    sqlDeserializer: noChange,
    validator: z.string,
  },
  bigint: {
    sqlColumnType: numeric,
    sqlSerializer: toString,
    sqlDeserializer: noChange,
    validator: z.bigint,
  },
  boolean: {
    sqlColumnType: numeric,
    sqlSerializer: value => (value ? '1' : '0'),
    sqlDeserializer: value => !!value,
    validator: z.boolean,
  },
  symbol: {
    sqlColumnType: text,
    sqlSerializer: unknown,
    sqlDeserializer: noChange,
    validator: z.symbol,
  },
  object: {
    sqlColumnType: text,
    sqlSerializer: stringify,
    sqlDeserializer: JSONparse,
    validator: z.object({}).passthrough,
  },
  array: {
    sqlColumnType: text,
    sqlSerializer: unknown,
    sqlDeserializer: JSONparse,
    validator: z.any().array,
  },
  function: {
    sqlColumnType: text,
    sqlSerializer: unknown,
    sqlDeserializer: noChange,
    validator: z.function,
  },
  undefined: {
    sqlColumnType: text,
    sqlSerializer: unknown,
    sqlDeserializer: noChange,
    validator: z.undefined,
  },
};
