const userDB = require('../schemas/users-schema');

exports.insertIntoUsers = (dataObj) => {
    const addedUser = new userDB(dataObj);
    return addedUser.save();
}

exports.findUser = (dataObj) => {
    return userDB.find(dataObj);
}