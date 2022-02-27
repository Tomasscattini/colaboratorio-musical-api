const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'Author'
        },
        privacyStatus: {
            type: String,
            enum: ['private', 'public'],
            default: 'private'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
