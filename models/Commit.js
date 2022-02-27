const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commitSchema = new Schema({
    tree: {
        type: String,
        required: true
    },
    parent: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    commiter: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = commitSchema;
