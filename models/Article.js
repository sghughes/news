var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: {index: {unique: true}}
    },
    summary: {
        type: String,
        // required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean, 
        default: false
    
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;