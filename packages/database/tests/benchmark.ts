import { IEntity } from '@cypherock/db-interfaces';
import { testHelper } from './__helpers__/testHelper';
import fixtures from './__fixtures__';

describe('Benchmark', () => {
  const num = 500;
  const transaction = fixtures[3];
  beforeAll(async () => {
    await testHelper.setupTestDB();
    transaction.setRepository(testHelper.db);
  });

  afterAll(() => {
    testHelper.teardownTestDB();
  });

  test(`Should be able to insert ${num} entities in database`, async () => {
    transaction.repo.setVersion(0);
    const objs: IEntity[] = [];
    for (let i = 0; i < num; i += 1) {
      objs.push(transaction.onlyRequired[0]);
    }
    const startTime = performance.now();
    const output = await transaction.repo.insert(objs);
    const endTime = performance.now();
    console.log(
      `Insertion ${num} entries took ${endTime - startTime} milliseconds`,
    );
    expect(output.length).toEqual(num);
  });

  test(`Should be able to update ${num} entities in database`, async () => {
    transaction.repo.setVersion(0);
    const objs: IEntity[] = [];
    for (let i = 0; i < num; i += 1) {
      objs.push(transaction.onlyRequired[0]);
    }
    await transaction.repo.insert(objs);
    const startTime = performance.now();
    const output = await transaction.repo.update(
      undefined,
      { hash: 'test' } as any,
      {
        limit: num,
      },
    );
    const endTime = performance.now();
    console.log(
      `Updating ${num} entries took ${endTime - startTime} milliseconds`,
    );
    expect(output.length).toEqual(num);
  });

  test(`Should be able to remove ${num} entities in database`, async () => {
    transaction.repo.setVersion(0);
    const objs: IEntity[] = [];
    for (let i = 0; i < num; i += 1) {
      objs.push(transaction.onlyRequired[0]);
    }
    await transaction.repo.insert(objs);
    const startTime = performance.now();
    const output = await transaction.repo.remove({ __version: 0 } as any, {
      limit: num,
    });
    const endTime = performance.now();
    console.log(
      `Removing ${num} entries took ${endTime - startTime} milliseconds`,
    );
    expect(output.length).toEqual(num);
  });
});
