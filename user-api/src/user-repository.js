/**
 * @param {user} user
 * @return {user}
 */
function addIdToUser(user) {
  user.id = user._id;
  delete user._id;
  return user;
}
/**
 * @class {userRepository}
 *
 * */
class UserRepository {
  /**
   * Esta classe fará acesso ao repositório , manipulando o mongodb
   * @param {*} collection - Recebe a coleção com acesso ao banco para ser manipulado.
   */
  constructor(collection) {
    this.collection = collection;
  }
  /**
   * @param {id} id
   * @return {user}
   */
  async findOneById(id) {
    const user = await this.collection.findOne({_id: id});
    if (user === null) {
      throw new Error('User with email john@doe.com does not exist');
    }
    return addIdToUser(user);
    // return user;
  }
  /**
   *
   * @param {*} email
   * @return {user}
   */
  async findOneByEmail(email) {
    const user = await this.collection.findOne({email});
    if (user === null) {
      throw new Error('User with email john@doe.com does not exist');
    }
    return addIdToUser(user);
    // return user;
  }
  /**
   *
   * @param {*} user
   * @return {user}
   */
  async insert(user) {
    await this.collection.insertOne(user);
    return addIdToUser(user);
    // return user;
  }
  /**
   *
   * @param {*} id
   */
  async delete(id) {
    const result = await this.collection.deleteOne({_id: id});
    if (result.deletedCount == 0) {
      throw new Error('User with email john@doe.com does not exist');
    }
  }
  /**
   *
   * @param {*} id
   * @param {*} user
   * @return {user}
   */
  async update(id, user) {
    const result = await this.collection.updateOne(
        {_id: id},
        {
          $set: {
            name: user.name,
            email: user.email,
          },
        },
    );
    const {matchedCount} = result;
    // console.log(matchedCount);
    if (matchedCount === 0) {
      throw new Error(
          'Não foi possível fazer o update, o usuário não foi encontrado',
      );
    }

    return await this.findOneByEmail(user.email);
  }
  /**
   *
   * @return {Array} user
   */
  async findAll() {
    const result = await this.collection.find().toArray();

    if (result.length == 0) {
      throw new Error('Não foi encontrado nenhum usuário');
    }
    return result.map(addIdToUser);
    // return result;
    // console.info(result.length);
  }
  /**
   * Deleta todos os registros e deixa a base limpa
   */
  async deleteAll() {
    await this.collection.deleteMany({});
  }
}

module.exports = UserRepository;
