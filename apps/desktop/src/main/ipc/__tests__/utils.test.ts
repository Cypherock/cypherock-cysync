import { describe, expect, test } from '@jest/globals';

import { fixtures } from '../__fixtures__/utils';
import { callMethodOnObject, getMethodListFromObject } from '../helpers/utils';

describe('IPC Helpers', () => {
  describe('getMethodListFromObject', () => {
    fixtures.forEach(t => {
      test(t.name, () => {
        const methodList = getMethodListFromObject(
          t.params.obj,
          t.params.depth,
        );

        for (const method of t.methodList) {
          expect(methodList).toContain(method);
        }
      });
    });
  });

  describe('callMethodOnObject', () => {
    fixtures.forEach(t => {
      t.calls.forEach(call => {
        test(`${t.name}, method call: ${call.method}`, () => {
          if (call.func) {
            call.func.mockClear();
          }

          const result = callMethodOnObject(
            t.params.obj,
            call.method,
            ...call.args,
          );

          expect(result).toEqual(call.result);
          if (call.func) {
            expect(call.func.mock.calls.length).toEqual(1);
            expect(call.func.mock.lastCall).toEqual(call.args);
          }
        });
      });
    });
  });
});
