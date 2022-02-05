const request = require('supertest');
const app = require('./app');
const {MongoClient} = require('mongodb'); // Já importou o mongo Client
const UserRepository = require('./user-repository');
// const {ObjectId} = require('bson');

describe('UserApi', () => {
  let userRepository;
  let collection;
  let client;

  beforeAll(async () => {
    const uri = 'mongodb://localhost';
    // const uri = 'mongodb://rafael:123abc@localhost/usuarios?retryWrites=true&w=majority';
    client = new MongoClient(uri);
    await client.connect();
    collection = client.db('users_db').collection('users');
    userRepository = new UserRepository(collection);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  describe('/users', () => {
    describe('GET /', () => {
      // test.todo("Deve retornar uma lista vazia de usuários");
      test('Deve retornar uma lista vazia de usuários', async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });

      // test.todo("Deve retornar uma lista contendo dois usuários");
      test('Deve retornar uma lista contendo dois usuários', async () => {
        /* Poderia ter criado um método na classe userRepository para inserir
          Mais de um usuário
        */
        await userRepository.insert({
          name: 'John Doe',
          email: 'john@doe.com',
        });

        await userRepository.insert({
          name: 'Bob Doe',
          email: 'bob@doe.com',
        });

        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);

        expect(response.body[0]).toEqual(
            expect.objectContaining({
              name: 'John Doe',
              email: 'john@doe.com',
            }),
        );

        expect(response.body[1]).toEqual(
            expect.objectContaining({
              name: 'Bob Doe',
              email: 'bob@doe.com',
            }),
        );
      });
    });

    describe('POST /', () => {
      // test.todo("Deve incluir o usuário no banco de dados");
      test('Deve incluir o usuário no banco de dados', async () => {
        const response = await request(app).post('/users').send({
          name: 'John Doe',
          email: 'john@doe.com',
        });

        expect(response.statusCode).toBe(201); // O Código 201 representa que um determinado recurso foi criado com sucesso no backend

        const user = await userRepository.findOneByEmail('john@doe.com');
        expect(user).toEqual(
            expect.objectContaining({
              name: 'John Doe',
              email: 'john@doe.com',
            }),
        );
      });
      test.todo(
          'Não deve permitir a inclusão de usuários com e-mails duplicados',
      );
    });
  });

  describe('/users/:id', () => {
    describe('GET /', () => {
      // test.todo("Deve retornar os dados de um usuário");
      test('Deve retornar os dados de um usuário', async () => {
        const user = await userRepository.insert({
          name: 'John Doe',
          email: 'john@doe.com',
        });

        const response = await request(app).get(`/users/${user.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
              name: 'John Doe',
              email: 'john@doe.com',
            }),
        );
      });

      // test.todo("Deve retornar status code 404 para usuário não existente");
      test('Deve retornar status code 404 para usuário não existente', async () => {
        const response = await request(app).get(
            `/users/61bfca54e1697cc3a2cb3aec`,
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({
          message: 'User not found',
          code: 404,
        });
      });
    });

    // Implementar mais tarde o Put e Delete com calma como dever de casa
    describe('PUT /', () => {
      test('Deve atualizar os dados de um usuário', async () => {
        const user = await userRepository.insert({
          name: 'John Doe',
          email: 'john@doe.com',
        });
        user.name='Rafael Zeitoune';
        user.email='rafaelzeitoune@yahoo.com.br';
        const response = await request(app).put(`/users/${user.id}`).send(user);
        expect(response.statusCode).toBe(200);
        /*
        expect(response.body).toEqual(
          expect.objectContaining(user)
        );*/
      });

      test('Deve retornar status code 404 para usuário não existente', async () => {
        const response = await request(app)
            .put(`/users/61bfca54e1697cc3a2cb3aec`)
            .send({name: 'John Doe', email: 'john@doe.com'})

        // console.info(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({
          message: 'User not found',
          code: 404,
        });
      });
    });

    describe('DELETE /', () => {
      test('Deve remover um usuário', async () => {
        const user = await userRepository.insert({
          name: 'John Doe',
          email: 'john@doe.com',
        });
        const response = await request(app).delete(`/users/${user.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          message: 'User delete with success',
          code: 200,
        });
      });

      test('Deve retornar status code 404 para usuário não existente', async () => {
        const response = await request(app).delete(
            `/users/61bfca54e1697cc3a2cb3aec`,
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({
          message: 'User not found',
          code: 404,
        });
      });
    });
  });
});

/**
 * Esses são os endpoints que minha aplicação terá
 *
 */
// Get /users -> listar todos os usuários
// Post /users -> Criar um usuário

// Get /users/:id -> Detalhar o usuário
// Put /users/:id -> Atualizar o usuário
// Delete /users/:id -> remove o usuário
