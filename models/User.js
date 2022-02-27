const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        addedBy: String,
        email: String,
        isLocked: {
            type: Boolean,
            default: false
        },
        isValidated: {
            type: Boolean,
            default: true
        },
        language: {
            type: String,
            default: 'es'
        },
        password: String,
        passwordResetRequests: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        wrongPasswordCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
