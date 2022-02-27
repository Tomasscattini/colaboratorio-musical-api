const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blobSchema = new Schema({
    content: {
        type: String,
        required: true
    }
});

module.exports = blobSchema;
