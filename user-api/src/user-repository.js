function addIdToUser(user) {
  user.id = user._id;
  delete user._id;
  return user;
}

class UserRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async findOneById(id) {
    const user = await this.collection.findOne({ _id: id });
    if (user === null) {
      throw new Error("User with email john@doe.com does not exist");
    }
    return addIdToUser(user);
    //return user;
  }

  async findOneByEmail(email) {
    const user = await this.collection.findOne({ email });
    if (user === null) {
      throw new Error("User with email john@doe.com does not exist");
    }
    return addIdToUser(user);
    //return user;
  }

  async insert(user) {
    await this.collection.insertOne(user);
    return addIdToUser(user);
    //return user;
  }

  async delete(id) {
    const result = await this.collection.deleteOne({ _id: id });
    if (result.deletedCount == 0) {
      throw new Error("User with email john@doe.com does not exist");
    }
  }

  async update(id, user) {
    const result = await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          name: user.name,
          email: user.email,
        },
      }
    );
    let { matchedCount } = result;
    //console.log(matchedCount);
    if (matchedCount === 0) {
      throw new Error(
        "Não foi possível fazer o update, o usuário não foi encontrado"
      );
    }

    return await this.findOneByEmail(user.email);
  }

  async findAll() {
    const result = await this.collection.find().toArray();

    if (result.length == 0) {
      throw new Error("Não foi encontrado nenhum usuário");
    }
    return result.map(addIdToUser);
    //return result;
    //console.info(result.length);
  }

  async deleteAll() {
    await this.collection.deleteMany({});
  }
}

module.exports = UserRepository;
