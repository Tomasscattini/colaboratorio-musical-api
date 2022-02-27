const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treeSchema = new Schema({
    node: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['blob', 'tree'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sha: {
        type: String,
        required: true
    }
});

module.exports = treeSchema;
