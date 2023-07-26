import { IEntity } from '@cypherock/db-interfaces';
import lodash from 'lodash';

import fixtures from './__fixtures__';
import {
  compareEntityArray as expectEqualEntityArray,
  removeBaseFelids,
  removeLokiFields,
  testHelper,
} from './__helpers__/testHelper';

import { createDb } from '../src/index';

describe('Basic tests', () => {
  beforeAll(async () => {
    await testHelper.setupTestDB();
  });

  afterAll(() => {
    testHelper.teardownTestDB();
  });

  test('Can create a new database instance', async () => {
    const db = await createDb(':memory:');
    await db.load();
    expect(db).toBeDefined();
    const devices = await db.device.getAll();
    expect(devices.length).toEqual(0);
    await db.close();
    expect(db.device.getAll()).rejects.toThrow();
  });

  fixtures.forEach(entity => {
    describe(`${entity.name}`, () => {
      beforeAll(async () => {
        entity.setRepository(testHelper.db);
      });

      describe('insert', () => {
        test('Can not store an empty entity instance', async () => {
          const obj = {};
          expect(entity.repo.insert(obj)).rejects.toThrow();
        });

        test('Can not store an entity with invalid values', async () => {
          entity.repo.setVersion(0);
          for (const invalidCase of entity.invalid) {
            expect(entity.repo.insert(invalidCase)).rejects.toThrow();
          }
        });

        test('Can not store an entity with partial values', async () => {
          entity.repo.setVersion(0);
          for (const partialCase of entity.partial) {
            expect(entity.repo.insert(partialCase)).rejects.toThrow();
          }
        });

        test('Can not store an entity array with invalid values', async () => {
          entity.repo.setVersion(0);
          expect(entity.repo.insert(entity.invalid)).rejects.toThrow();
        });

        test('Can not store an entity array with partial values', async () => {
          entity.repo.setVersion(0);
          expect(entity.repo.insert(entity.partial)).rejects.toThrow();
        });

        test('Can store the entity array with all required values', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 3);
          const storedObj = await entity.repo.insert(obj);
          expect(storedObj).toBeTruthy();
        });

        test('Can store the entity array with all values', async () => {
          entity.repo.setVersion(0);
          const obj = entity.all.slice(0, 3);
          const storedObj = await entity.repo.insert(obj);
          expect(storedObj).toBeTruthy();
        });

        test('Can override table version when provided within the object', async () => {
          entity.repo.setVersion(0);
          const obj = {
            ...entity.onlyRequired[0],
            __version: 1,
          };
          const storedObj = await entity.repo.insert(obj);
          expect(storedObj).toBeTruthy();
          const fetchedObj = await entity.repo.getOne(storedObj);
          expect(fetchedObj).toBeTruthy();
          expect(fetchedObj?.__version).toStrictEqual(obj.__version);
        });
      });

      describe('update', () => {
        test('Can update an entity', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insert(obj);
          expect(removeBaseFelids(storedObj)).toEqual(obj);
          const newObj = {
            ...entity.onlyRequired[1],
          };

          const newStoredObjs = await entity.repo.update(
            {
              __id: storedObj.__id,
            },
            newObj,
          );

          expect(newStoredObjs.length).toEqual(1);
          expect(removeLokiFields(newStoredObjs[0])).toEqual({
            ...newObj,
            __id: storedObj.__id,
            __version: storedObj.__version,
          });
        });

        test('Can update multiple entities at once', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);
          const storedObj = await entity.repo.insert(obj);

          const searchObj: IEntity[] = [];
          const newObj = entity.onlyRequired[3];
          for (let i = 0; i < obj.length; i += 1) {
            expect(removeBaseFelids(storedObj[i])).toEqual(obj[i]);
            searchObj.push({
              __id: storedObj[i].__id,
            });
          }

          const newStoredObjs = await entity.repo.update(searchObj, newObj);

          expect(newStoredObjs.length).toEqual(2);

          for (let i = 0; i < obj.length; i += 1) {
            expect(removeBaseFelids(newStoredObjs[i])).toEqual({ ...newObj });
          }
        });
        if (entity.optionalRandomUndefined) {
          test('Can update an optional field back to undefined', async () => {
            entity.repo.setVersion(0);
            const obj = entity.all[0];
            const storedObj = await entity.repo.insert(obj);
            expect(removeBaseFelids(storedObj)).toEqual(obj);
            for (const testCase of entity.optionalRandomUndefined!) {
              const newObj = {
                ...entity.all[0],
                ...testCase,
              };

              const newStoredObjs = await entity.repo.update(
                {
                  __id: storedObj.__id,
                },
                newObj,
              );
              expect(newStoredObjs.length).toEqual(1);
              expect(removeLokiFields(newStoredObjs[0])).toEqual({
                ...newObj,
                __id: storedObj.__id,
                __version: storedObj.__version,
              });
            }
          });
        }
      });

      describe('getOne', () => {
        test('The fetched entity should be same as the stored object', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insert(obj);
          const fetchedObj = await entity.repo.getOne(storedObj);
          expect(fetchedObj).toBeDefined();
          expect(removeBaseFelids(fetchedObj ?? {})).toEqual(obj);
          expect(storedObj).toEqual(fetchedObj);
        });
        test('Can not fetch an entity with invalid values', async () => {
          entity.repo.setVersion(0);
          expect(entity.repo.getOne(entity.invalid)).rejects.toThrow();
        });
      });

      describe('getAll', () => {
        test('Get multiple entities', async () => {
          const entitiesBeforeInsert = await entity.repo.getAll();

          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);

          const storedObj = await entity.repo.insert(obj);
          const fetchedObj = await entity.repo.getAll();

          expectEqualEntityArray(
            [...entitiesBeforeInsert, ...storedObj],
            fetchedObj,
          );
        });

        test('The fetched entity array should be the same as stored object array', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);
          const storedObj = await entity.repo.insert(obj);
          const fetchedObj = await entity.repo.getAll(storedObj);
          expect(storedObj).toEqual(fetchedObj);
        });

        test('Can not fetch an entity with invalid values', async () => {
          entity.repo.setVersion(0);
          expect(entity.repo.getAll(entity.invalid)).rejects.toThrow();
        });

        test('Get multiple entities in sorted order', async () => {
          const entitiesBeforeInsert = await entity.repo.getAll();

          entity.repo.setVersion(0);
          const objectsToInsert = entity.onlyRequired;
          const storedObj = await entity.repo.insert(objectsToInsert);
          const fetchedObj = await entity.repo.getAll(undefined, {
            sortBy: {
              key: entity.sortKey as any,
              descending: entity.isSortDescending,
            },
          });

          expectEqualEntityArray(
            [...entitiesBeforeInsert, ...storedObj],
            fetchedObj,
          );

          const newStoredObjects = lodash.difference(
            fetchedObj,
            entitiesBeforeInsert,
          );

          for (let i = 0; i < newStoredObjects.length; i += 1) {
            const storedEntity: any = newStoredObjects[i];
            delete storedEntity.__id;
            delete storedEntity.__version;

            expectEqualEntityArray([entity.sorted[i]], [storedEntity]);
          }
        });

        test('Get limited entities in sorted order', async () => {
          await entity.repo.remove({});

          entity.repo.setVersion(0);
          const objectsToInsert = entity.onlyRequired;
          await entity.repo.insert(objectsToInsert);
          const fetchedObj = await entity.repo.getAll(undefined, {
            sortBy: {
              key: entity.sortKey as any,
              descending: entity.isSortDescending,
            },
            limit: 1,
          });

          const storedEntity: any = fetchedObj[0];
          delete storedEntity.__id;
          delete storedEntity.__version;

          expectEqualEntityArray([entity.sorted[0]], [storedEntity]);
        });
      });

      describe('remove', () => {
        test('Can remove an entity', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insert(obj);
          const allObjBeforeRemove = await entity.repo.getAll();
          await entity.repo.remove(storedObj);
          const fetchedObj = await entity.repo.getAll(storedObj);
          const allObjAfterRemove = await entity.repo.getAll();
          expectEqualEntityArray(
            [...allObjAfterRemove, storedObj],
            allObjBeforeRemove,
          );
          expect(fetchedObj.length).toEqual(0);
        });

        test('Can remove multiple entities at once', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);
          const storedObj = await entity.repo.insert(obj);
          const allObjBeforeRemove = await entity.repo.getAll();
          await entity.repo.remove(storedObj);
          const fetchedObj = await entity.repo.getAll(storedObj);
          const allObjAfterRemove = await entity.repo.getAll();
          expectEqualEntityArray(
            [...allObjAfterRemove, ...storedObj],
            allObjBeforeRemove,
          );
          expect(fetchedObj.length).toEqual(0);
        });

        test('Can not remove an entity with invalid parameter values', async () => {
          entity.repo.setVersion(0);
          expect(entity.repo.remove(entity.invalid)).rejects.toThrow();
        });
      });

      describe('addListener', () => {
        test('Can Listen to changes in entity.repository', async () => {
          entity.repo.setVersion(0);
          let changed = false;
          entity.repo.addListener('change', () => {
            changed = true;
          });
          await entity.repo.insert(entity.onlyRequired[0]);
          expect(changed).toEqual(true);
        });
      });
      describe('removeListener', () => {
        test('Can not listen to changes after removing the listener', async () => {
          entity.repo.setVersion(0);
          let changed = false;
          const listener = () => {
            changed = true;
          };
          entity.repo.addListener('change', listener);
          await entity.repo.insert(entity.onlyRequired[0]);
          expect(changed).toEqual(true);
          changed = false;
          entity.repo.removeListener('change', listener);
          await entity.repo.insert(entity.onlyRequired[1]);
          expect(changed).toEqual(false);
        });
      });

      describe('removeAllListener', () => {
        test('Can not listen to changes after removing the all the listeners', async () => {
          entity.repo.setVersion(0);
          let changed = false;
          let listened = false;
          entity.repo.addListener('change', () => {
            changed = true;
          });
          entity.repo.addListener('change', () => {
            listened = true;
          });
          await entity.repo.insert(entity.onlyRequired[0]);
          expect(changed).toEqual(true);
          expect(listened).toEqual(true);
          changed = false;
          listened = false;
          entity.repo.removeAllListener('change');
          await entity.repo.insert(entity.onlyRequired[1]);
          expect(changed).toEqual(false);
          expect(listened).toEqual(false);
        });
      });
    });
  });
});
