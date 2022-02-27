const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blobSchema = require('./Blob');
const commitSchema = require('./Commit');
const treeSchema = require('./Tree');

const projectSchema = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'Author'
        },
        blobs: [blobSchema],
        collaborators: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Author'
            }
        ],
        commits: [commitSchema],
        headVersion: String,
        privacyStatus: {
            type: String,
            enum: ['private', 'public'],
            default: 'private'
        },
        suggestions: [String],
        trees: [treeSchema],
        workStatus: {
            type: String,
            enum: ['composing', 'published'],
            default: 'composing'
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
