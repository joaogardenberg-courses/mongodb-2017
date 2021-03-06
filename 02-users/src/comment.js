const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  blogPost: {
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  content: String
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;