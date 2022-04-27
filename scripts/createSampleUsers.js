const faker = require("faker");
const db = require("../server/data/db");
const UserDao = require("../server/data/UserDao");

async function createSampleUsers() {
  try {
    await db.connect();

    const users = new UserDao();
    const userInfo = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };
    //console.log(userInfo);
    const user = await users.makeNewUser(userInfo);
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

const numUsers = 5; //change this to whatever number of sample users you would like
for(let i = 0; i < numUsers; i++){
  createSampleUsers();
}


