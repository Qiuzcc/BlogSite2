const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: { type: String, required: true },
    classification: { type: String, required: true, default: "其它" },
    abstract: { type: String },
    content: { type: String },
    picture: { type: String },
    timestamp: { type: Date, default: Date.now() },
});

ArticleSchema.virtual('url')
    .get(function () {
        return "/article/" + this.id;
    })

ArticleSchema.virtual('date')
    .get(function () {
        return moment(this.timestamp).format("YYYY MMMM Do");
    })

module.exports = mongoose.model('Article', ArticleSchema);