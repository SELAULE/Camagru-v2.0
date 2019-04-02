const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        index: true
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    passwordResetToken: String,

    passwordResetTokenDate: Date,

    email: {
        type: String,
        require: true
    },
    googleid: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    }
});

const tokenSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

// const User = module.exports = mongoose.model('User', UserSchema);

// Creating the user

const User = module.exports = mongoose.model('User', UserSchema);
const token = module.exports = mongoose.model('token', tokenSchema);
// module.exports.createUser = (newUser, callback) => {
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
// }

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