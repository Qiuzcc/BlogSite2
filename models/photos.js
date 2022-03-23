const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const PhotosSchema = new Schema({
    title: { type: String },
    description: { type: String },
    file: { type: String },
    timestamp: { type: Date, default: Date.now() },
    views: { type: Number, default: 0 }
});

PhotosSchema.virtual('url')
    .get(function () {
        return "/photos/" + this.id;
    })

PhotosSchema.virtual('date')
    .get(function () {
        return moment(this.timestamp).format("YYYY MMMM Do");
    })

module.exports = mongoose.model('Photos', PhotosSchema);