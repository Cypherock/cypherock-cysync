import {
  rand,
  randTextRange,
  randAddress,
  randBook,
  randCreditCard,
  randPost,
  randUser,
  randFlightDetails,
  randProduct,
  randTodo,
  randSuperhero,
  randBoolean,
  randNumber,
} from '@ngneat/falso';

import { datatype, ITableSchema } from '../../../src/repository/utils/types';

export type IGenerator = () => Record<string, any>;

const dataGenerators: Record<datatype, () => any> = {
  string: () => randTextRange({ min: 1, max: 1000 }),
  number: () => randNumber(),
  boolean: () => randBoolean(),
  object: () =>
    rand([
      randAddress(),
      randBook(),
      randCreditCard(),
      randPost(),
      randUser(),
      randFlightDetails(),
      randProduct(),
      randTodo(),
      randSuperhero(),
    ]),
  array: () =>
    new Array(randNumber({ min: 1, max: 10 }))
      .fill(null)
      .map(() =>
        rand([
          dataGenerators.string(),
          dataGenerators.number(),
          dataGenerators.boolean(),
          dataGenerators.object(),
          dataGenerators.bigint(),
        ]),
      ),
  bigint: () => randNumber(),
};

const generateDataForType = (t: datatype) => dataGenerators[t]();

export const createGenerator =
  (schema: ITableSchema<any>, optionalRandomness = 0.5): IGenerator =>
  () => {
    const keys = Object.keys(schema);
    const obj: Record<string, any> = { __version: 0 };

    for (const key of keys) {
      const { type, isOptional } = schema[key];
      const doExclude = isOptional && Math.random() < optionalRandomness;

      if (!doExclude) {
        obj[key] = generateDataForType(type);
      }
    }

    return obj;
  };

export const generateDataList = (generator: IGenerator, count: number) =>
  new Array(count).fill(null).map(() => generator());
