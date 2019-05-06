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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        // required: [true,"there is no token here"]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

const picturesSchema = mongoose.Schema({
    userId: String,
    image_path: String,
});

const commentsSchema = mongoose.Schema({
    image_id: String,
    // username: String,
    comment: String
});

const Comments = mongoose.model('Comments', commentsSchema);
const Images = mongoose.model('Images', picturesSchema);
const Token = mongoose.model('Token', tokenSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
    User: User,
    Token: Token,
    Images: Images,
    Comments: Comments
}