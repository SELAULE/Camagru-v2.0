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
    },
    notify: {
        type: Boolean,
        default: true
    }
});

// Token Schema
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

// Token Schema for Password
const tokenSchemaPass = new mongoose.Schema({
    email: {
        type: String
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

// Picture Schema
const picturesSchema = mongoose.Schema({
    userId: String,
    image_path: String,
});

// Comment Schema
const commentsSchema = mongoose.Schema({
    image_id: String,
    // username: String,
    comment: String
});

// Likes Schema
const likesSchema = mongoose.Schema({
    imageId: String,
    userId: String,
    status: {type: Boolean, default: false}
})


const Comments = mongoose.model('Comments', commentsSchema);
const Images = mongoose.model('Images', picturesSchema);
const Token = mongoose.model('Token', tokenSchema);
const PassToken = mongoose.model('PassToken', tokenSchemaPass);
const Likes = mongoose.model('Likes', likesSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
    User: User,
    Token: Token,
    PassToken: PassToken,
    Likes: Likes,
    Images: Images,
    Comments: Comments
}