import { removeBaseFelids, testHelper } from './__helpers__/testHelper';
import fixtures from './__fixtures__';

describe('Basic tests', () => {
  beforeAll(async () => {
    await testHelper.setupTestDB();
  });

  afterAll(() => {
    testHelper.teardownTestDB();
  });
  fixtures.forEach(entity => {
    describe(`${entity.name}`, () => {
      beforeAll(async () => {
        entity.setRepository(testHelper.db);
      });

      // describe('instantiate', () => {
      //   test('Can create a new instance from a repository', async () => {
      //     const obj = entity.repo.instantiate();
      //     expect(obj).toBeTruthy();
      //   });

      //   test('Can create a new instance using a js object', async () => {
      //     const JsObject = entity.onlyRequired[0];
      //     const obj = entity.repo.instantiate(JsObject);
      //     expect(JsObject).toEqual(obj);
      //   });

      //   test('Can create new instances using an array of js object', async () => {
      //     const JsObjectArray = entity.onlyRequired.slice(0, 2);
      //     const obj = entity.repo.instantiate(JsObjectArray);
      //     expect(JsObjectArray).toEqual(obj);
      //   });
      // });

      describe('insertOrUpdate', () => {
        test('Can not store an empty entity instance', async () => {
          const obj = {};
          expect(entity.repo.insertOrUpdate(obj)).rejects.toThrow();
        });

        test('Can store the entity with all required values', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insertOrUpdate(obj);
          expect(storedObj).toBeTruthy();
        });

        test('Can store the entity array with all required values', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 3);
          const storedObj = await entity.repo.insertOrUpdate(obj);
          expect(storedObj).toBeTruthy();
        });

        test('Can override table version when provided within the object', async () => {
          entity.repo.setVersion(0);
          const obj = {
            ...entity.onlyRequired[0],
            __version: 1,
          };
          const storedObj = await entity.repo.insertOrUpdate(obj);
          expect(storedObj).toBeTruthy();
          const fetchedObj = await entity.repo.getOne(storedObj);
          expect(fetchedObj).toBeTruthy();
          expect(fetchedObj?.__version).toStrictEqual(obj.__version);
        });

        test('Can update an entity', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insertOrUpdate(obj);
          expect(removeBaseFelids(storedObj)).toEqual(obj);
          const newObj = {
            ...entity.onlyRequired[1],
            __id: storedObj.__id,
          };
          const newStoredObj = await entity.repo.insertOrUpdate(newObj);
          expect(newStoredObj).toEqual({
            ...newObj,
            __id: storedObj.__id,
            __version: storedObj.__version,
          });
        });

        test('Can update multiple entities at once', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);
          const storedObj = await entity.repo.insertOrUpdate(obj);

          const newObj = [];
          for (let i = 0; i < obj.length; i += 1) {
            expect(removeBaseFelids(storedObj[i])).toEqual(obj[i]);
            newObj.push({
              ...entity.onlyRequired[2 + i],
              __id: storedObj[i].__id,
              __version: storedObj[i].__version,
            });
          }

          const newStoredObj = await entity.repo.insertOrUpdate(newObj);

          for (let i = 0; i < obj.length; i += 1) {
            expect(newStoredObj[i]).toEqual(newObj[i]);
          }
        });
      });

      describe('getOne', () => {
        test('The fetched entity should be same as the stored object', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insertOrUpdate(obj);
          const fetchedObj = await entity.repo.getOne(storedObj);
          expect(storedObj).toEqual(fetchedObj);
        });
      });

      describe('getAll', () => {
        test('The fetched entity array should be the same as stored object array', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);
          const storedObj = await entity.repo.insertOrUpdate(obj);
          const fetchedObj = await entity.repo.getAll(storedObj);
          expect(storedObj).toEqual(fetchedObj);
        });
      });

      describe('remove', () => {
        test('Can remove an entity', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired[0];
          const storedObj = await entity.repo.insertOrUpdate(obj);
          const allObjBeforeRemove = await entity.repo.getAll();
          await entity.repo.remove(storedObj);
          const fetchedObj = await entity.repo.getAll(storedObj);
          const allObjAfterRemove = await entity.repo.getAll();
          expect([...allObjAfterRemove, storedObj]).toEqual(allObjBeforeRemove);
          expect(fetchedObj.length).toEqual(0);
        });

        test('Can remove multiple entities at once', async () => {
          entity.repo.setVersion(0);
          const obj = entity.onlyRequired.slice(0, 2);
          const storedObj = await entity.repo.insertOrUpdate(obj);
          const allObjBeforeRemove = await entity.repo.getAll();
          await entity.repo.remove(storedObj);
          const fetchedObj = await entity.repo.getAll(storedObj);
          const allObjAfterRemove = await entity.repo.getAll();
          expect([...allObjAfterRemove, ...storedObj]).toEqual(
            allObjBeforeRemove,
          );
          expect(fetchedObj.length).toEqual(0);
        });
      });

      describe('addListener', () => {
        test('Can Listen to changes in entity.repository', async () => {
          entity.repo.setVersion(0);
          let changed = false;
          entity.repo.addListener('change', () => {
            changed = true;
          });
          await entity.repo.insertOrUpdate(entity.onlyRequired[0]);
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
          await entity.repo.insertOrUpdate(entity.onlyRequired[0]);
          expect(changed).toEqual(true);
          changed = false;
          entity.repo.removeListener('change', listener);
          await entity.repo.insertOrUpdate(entity.onlyRequired[1]);
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
          await entity.repo.insertOrUpdate(entity.onlyRequired[0]);
          expect(changed).toEqual(true);
          expect(listened).toEqual(true);
          changed = false;
          listened = false;
          entity.repo.removeAllListener('change');
          await entity.repo.insertOrUpdate(entity.onlyRequired[1]);
          expect(changed).toEqual(false);
          expect(listened).toEqual(false);
        });
      });
    });
  });
});
