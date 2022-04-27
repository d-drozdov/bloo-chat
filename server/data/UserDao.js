const User = require("../model/User");
const ApiError = require("../model/ApiError");
const { hashPassword } = require("../util/hashing");


class UserDao {
  
  async create({username, password}){
    if(username === undefined || username === ""){
      throw new ApiError(400, "Every new user must have a username");
    }
    if (password === undefined || password === ""){
      console.log(password);
      throw new ApiError(400, "Every user must have a password!");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({username, password: hashedPassword});
    return user;
  }

  async findUser(username){
    const user = await User.findOne({ username });
    return user;
  }
}

module.exports = UserDao;