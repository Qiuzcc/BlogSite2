const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PeopleSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    photo: { type: String },
    github: { type: String },
    wechat: { type: String },
    weibo: { type: String },
});

module.exports = mongoose.model('People', PeopleSchema);