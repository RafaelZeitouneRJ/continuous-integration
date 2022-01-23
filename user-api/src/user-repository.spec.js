const { MongoClient } = require("mongodb"); //Já importou o mongo Client
const UserRepository = require("./user-repository");

describe("UserRepository", () => {
  let userRepository;
  let collection;
  let client;

  beforeAll(async () => {
    const uri = "mongodb://localhost";
    //const uri = 'mongodb://rafael:123abc@localhost/usuarios?retryWrites=true&w=majority';
    client = new MongoClient(uri);
    await client.connect();
    collection = client.db("users_db").collection("users");
    userRepository = new UserRepository(collection);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
   await collection.deleteMany({});
  });

  describe("findOneById", () => {
    //test.todo('Deve retornar o usuário john@doe.com pelo ID');
    test("Deve retornar o usuário john@doe.com pelo ID", async () => {
      const result = await userRepository.insert({
        name: "John Does",
        email: "john@doe.com",
      });

      const user = await userRepository.findOneById(result.id);
    });

    //test.todo("Deve lançar uma exceção para um usuário não existente");
    test("Deve lançar uma exceção para um usuário não existente", async () => {
     const user = await expect(userRepository.findOneById()).rejects.toThrow(
        "User with email john@doe.com does not exist"
      );
      
    });
  });

  describe("findOneByEmail", () => {
    //test.todo("Deve retornar o usuário john@doe.com");
    test("Deve retornar o usuário john@doe.com", async () => {
      const result = await collection.insertOne({
        name: "John Doe",
        email: "john@doe.com",
      });

      const user = await userRepository.findOneByEmail("john@doe.com");
      expect(user).toStrictEqual({
        id: result.insertedId,
        name: "John Doe",
        email: "john@doe.com",
      });
      //console.log(user);
    });

    //test.todo("Deve lançar uma exceção para um usuário não existente");
    test("Deve lançar uma exceção para um usuário não existente", async () => {
      await expect(
        userRepository.findOneByEmail("john@doe.com")
      ).rejects.toThrow("User with email john@doe.com does not exist");
    });
  });

  describe("Insert", () => {
    //test.todo("Inserir um novo usuário");
    test("Inserir um novo usuário", async () => {
      const user = await userRepository.insert({
        name: "John Doe",
        email: "john@doe.com",
      });
      const result = await userRepository.findOneByEmail("john@doe.com");
      expect(result).toStrictEqual(user);
    });
  });

  describe("update", () => {
    test("Deve atualizar um usuário existente", async () => {
      const result = await userRepository.insert({
        name: "John Doe",
        email: "john@doe.com",
      });
      const user = result;
      user.name = "Rafael";
      user.email = "rafaelzeitoune@yahoo.com.br";
      expect(await userRepository.update(result.id,user)).toStrictEqual(user);
    });
    //test.todo("Deve atualizar um usuário existente" );
    //test.todo("Deve lançar uma exceção para um usuário não existente");

    test("Deve lançar uma exceção para um usuário não existente para fazer update", async () => {
      await expect(
        userRepository.update("61b8b326c866f10fa81cc9c2",{
          //id: "61b8b326c866f10fa81cc9c2",
          name: "Fernanada",
          email: "fernanda@yahoo.com.br",
        })
      ).rejects.toThrow(
        "Não foi possível fazer o update, o usuário não foi encontrado"
      );
    });
  });

  describe("delete", () => {
    //test.todo("Deve remover um usuário existente");
    test("Deve remover um usuário existente", async () => {
      const user = await userRepository.insert({
        name: "John Doe",
        email: "john@doe.com",
      });

      await userRepository.delete(user.id);
      await expect(
        userRepository.findOneByEmail("john@doe.com")
      ).rejects.toThrow("User with email john@doe.com does not exist");
    });

    test("Deve lançar uma exceção para um usuário não existente", async () => {
      await expect(
        userRepository.delete("61b8b326c866f10fa81cc9c2") //Coloquei um usuário qualquer para testar e verificar se ele irá tratar o usuário que não achar
      ).rejects.toThrow("User with email john@doe.com does not exist");
    });
    //test.todo("Deve lançar uma exceção para um usuário não existente");
  });

  describe("findAll", () => {
    //test.todo("Deve retornar uma lista vazia de usuários");
    test("Deve retornar uma lista contendo dois usuários", async () => {
      const user = await collection.insertMany([
        {
          name: "John Doe",
          email: "john@doe.com",
        },
        {
          name: "Kaleb Zeitoune",
          email: "kaleb.zeitoune@yahoo.com.br",
        },
      ]);
      //console.log({user:{insertedIds}});
      //console.log(ids1);
      let insertedIds = user.insertedIds;
      //console.log(insertedIds);
      //console.info(user.insertedIds[0]);
      const result = await userRepository.findAll();
      //console.info(result);
      expect(result).toStrictEqual([
        {
          id: insertedIds[0],
          name: "John Doe",
          email: "john@doe.com",
        },
        {
          id: insertedIds[1],
          name: "Kaleb Zeitoune",
          email: "kaleb.zeitoune@yahoo.com.br",
        },
      ]);
    });

    //test.todo("Deve retornar uma lista vazia de usuários");
    test("Deve retornar uma lista vazia de usuários", async () => {
      await expect(userRepository.findAll()).rejects.toThrow(
        "Não foi encontrado nenhum usuário"
      );
    });
  });
});
