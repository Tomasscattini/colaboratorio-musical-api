const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema(
    {
        email: String,
        firstName: String,
        instagramProfile: String,
        lastName: String,
        otherLink: String,
        personalWebsite: String,
        phoneNumber: String,
        professionalRole: String,
        profileImage: String,
        projectsOwned: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project'
            }
        ],
        spotifyProfile: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        youtubeChannel: String
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
