var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    id: Number,
    name: {
        type: String,
        require: true
    },
    chat: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model('Chat', chatSchema);