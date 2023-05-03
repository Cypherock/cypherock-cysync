// import { AppDataSource } from './data-source';
// import { Device } from './entity/Device';
// import { Wallet } from './entity/Wallet';

// const Create = async () => {
//   console.log('Inserting a new device into the database...');
//   const device = new Device();
//   device.serial = '4234';
//   device.isAuthenticated = true;
//   device.version = '1.2.3';
//   device.__version = 0;
//   const wallet = new Wallet();

//   await AppDataSource.manager.save(device);
//   const deviceRepo = await AppDataSource.getRepository(Device);
//   const [firstDevice] = await deviceRepo.find();
//   const wallets = await firstDevice.wallets;
//   console.log(wallets);
//   console.log(`Saved a new device with id: ${device.serial}`);
// };

// const Load = async () => {
//   console.log('Loading devices from the database...');
//   const devices = await AppDataSource.manager.find(Device);
//   console.log('Loaded devices: ', devices);
// };

// const Custom = async () => {
//   console.log('Custom function');

//   const queryRunner = AppDataSource.createQueryRunner();

//   const table = await queryRunner.getTable('user');
//   console.log(table);

//   console.log('Custom function completed');
// };

// AppDataSource.initialize()
//   .then(async () => {
//     await Custom();
//     // await Create();
//     // await Load();
//     // console.log("Inserting a new user into the database...");
//     // const user = new User();
//     // user.firstName = "Timber";
//     // user.lastName = "Saw";
//     // user.age = 25;
//     // await AppDataSource.manager.save(user);
//     // console.log("Saved a new user with id: " + user.id);

//     // console.log("Loading users from the database...");
//     // const users = await AppDataSource.manager.find(User);
//     // console.log("Loaded users: ", users);

//     // console.log(
//     // 	"Here you can setup and run express / fastify / any other framework."
//     // );
//   })
//   .catch(error => console.log(error));
