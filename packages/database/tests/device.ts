import { IDeviceRepository } from '@cypherock/db-interfaces';
import { testHelper } from './__helpers__/testhelper';

describe('Device Tests', () => {
  let repo: IDeviceRepository;

  beforeAll(async () => {
    await testHelper.setupTestDB();
    repo = testHelper.db.device;
  });

  afterAll(() => {
    testHelper.teardownTestDB();
  });

  test('Can create a new device instance from device repo', async () => {
    const deviceObj = repo.instantiate();
    expect(deviceObj).toBeTruthy();
  });

  test('Can create a new device instance using a js object', async () => {
    const deviceJsObject = { serial: 'serial', version: 'version' };
    const deviceObj = repo.instantiate(deviceJsObject);
    expect(deviceJsObject).toEqual(deviceObj);
  });

  test('Can create new device instances using an array of js object', async () => {
    const deviceJsObjectArray = [
      { serial: 'serial', version: 'version' },
      { serial: 'serial1', isAuthenticated: false },
    ];
    const deviceObj = repo.instantiate(deviceJsObjectArray);
    expect(deviceJsObjectArray).toEqual(deviceObj);
  });

  test('Can not store an empty database instance', async () => {
    const deviceObj = repo.instantiate();
    expect(repo.insertOrUpdate(deviceObj)).rejects.toThrow();
  });

  test('Can store device with all required values', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate({
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
    });
    const storedObj = await repo.insertOrUpdate(deviceObj);
    expect(storedObj).toBeTruthy();
  });

  test('Can store device array with all required values', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate([
      {
        serial: '1234',
        isAuthenticated: false,
        version: '1.0.0',
      },
      {
        serial: '1235',
        isAuthenticated: true,
        version: '1.0.0',
      },
    ]);
    const storedObj = await repo.insertOrUpdate(deviceObj);
    expect(storedObj).toBeTruthy();
  });

  test('Can override table version when provided within the object', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate({
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
      __version: 1,
    });
    const storedObj = await repo.insertOrUpdate(deviceObj);
    expect(storedObj).toBeTruthy();
    const fetchedObj = await repo.getOne(storedObj);
    expect(fetchedObj).toBeTruthy();
    expect(fetchedObj?.__version).toStrictEqual(deviceObj.__version);
  });

  test('The fetched object should be same as the stored object', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate({
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
    });
    const storedObj = await repo.insertOrUpdate(deviceObj);
    const fetchedObj = await repo.getOne(storedObj);
    expect(storedObj).toEqual(fetchedObj);
  });

  test('The fetched object array should be the same as stored object array', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate([
      {
        serial: '1234',
        isAuthenticated: false,
        version: '1.0.0',
      },
      {
        serial: '3480',
        isAuthenticated: true,
        version: '1.0.2',
      },
    ]);
    const storedObj = await repo.insertOrUpdate(deviceObj);
    const fetchedObj = await repo.getAll(storedObj);
    expect(storedObj).toEqual(fetchedObj);
  });

  test('Can update an object', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate({
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
    });
    const storedObj = await repo.insertOrUpdate(deviceObj);
    expect(storedObj.serial).toEqual(deviceObj.serial);
    const newSerial = '2345';
    storedObj.serial = newSerial;
    const newStoredObj = await repo.insertOrUpdate(storedObj);
    expect(newStoredObj.serial).toEqual(newSerial);
  });

  test('Can update multiple objects at once', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate([
      {
        serial: '1234',
        isAuthenticated: false,
        version: '1.0.0',
      },
      {
        serial: '3402',
        isAuthenticated: true,
        version: '1.0.4',
      },
    ]);
    const storedObj = await repo.insertOrUpdate(deviceObj);

    const newSerial = ['2345', '18395'];
    for (let i = 0; i < deviceObj.length; i += 1) {
      expect(storedObj[i].serial).toEqual(deviceObj[i].serial);
      storedObj[i].serial = newSerial[i];
    }

    const newStoredObj = await repo.insertOrUpdate(storedObj);

    for (let i = 0; i < deviceObj.length; i += 1) {
      expect(newStoredObj[i].serial).toEqual(newSerial[i]);
    }
  });

  test('Can remove an object', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate({
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
    });
    const storedObj = await repo.insertOrUpdate(deviceObj);
    const allObjBeforeRemove = await repo.getAll();
    await repo.remove(storedObj);
    const fetchedObj = await repo.getAll(storedObj);
    const allObjAfterRemove = await repo.getAll();
    expect([...allObjAfterRemove, storedObj]).toEqual(allObjBeforeRemove);
    expect(fetchedObj.length).toEqual(0);
  });

  test('Can remove multiple objects at once', async () => {
    repo.setVersion(0);
    const deviceObj = repo.instantiate([
      {
        serial: '1234',
        isAuthenticated: false,
        version: '1.0.0',
      },
      {
        serial: '3402',
        isAuthenticated: true,
        version: '1.0.4',
      },
    ]);
    const storedObj = await repo.insertOrUpdate(deviceObj);
    const allObjBeforeRemove = await repo.getAll();
    await repo.remove(storedObj);
    const fetchedObj = await repo.getAll(storedObj);
    const allObjAfterRemove = await repo.getAll();
    expect([...allObjAfterRemove, ...storedObj]).toEqual(allObjBeforeRemove);
    expect(fetchedObj.length).toEqual(0);
  });

  test('Can Listen to changes in repository', async () => {
    repo.setVersion(0);
    let changed = false;
    repo.addListener('change', () => {
      console.log('changed');
      changed = true;
    });
    await repo.insertOrUpdate({
      serial: 'test',
      version: '123',
      isAuthenticated: false,
    });
    expect(changed).toEqual(true);
  });
});
