const {MongoClient} = require('mongodb');
const UserRepository = require('./user-repository.js');

(async () => {
  // const uri = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority'
  const uri = 'mongodb://localhost';
  const client = new MongoClient(uri);
  await client.connect();
  const collection = client.db('users_db').collection('users');
  const userRepository = new UserRepository(collection);
  await userRepository.deleteAll();
  await client.close();
  console.log('Database cleared');
})();
