const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    googleid: {
        type: String
    }
});

// const User = module.exports = mongoose.model('User', UserSchema);

// Creating the user

const User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Retrieving the user by username
module.exports.getUserByUsername = (username, callback) => {
    var query = {username: username};
    User.findOne(query, callback);
}

// Retrieving the user by Id

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

// Checking Passwords

module.exports.comparePassword = function (canPassword, hash, callback) {
    bcrypt.compare(canPassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
});
}