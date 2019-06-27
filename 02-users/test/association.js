const assert = require('assert');

const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'Title', content: 'Content' });
    comment = new Comment({ content: 'Content' });

    joe.blogPosts.push(blogPost);
    blogPost.user = joe;
    blogPost.comments.push(comment);
    comment.blogPost = blogPost;
    comment.user = joe;

    Promise.all([
      joe.save(),
      blogPost.save(),
      comment.save()
    ])
      .then(() => done());
  });

  it('saves a relation between a user and a blogpost', (done) => {
    User
      .findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        model: 'blogPost',
        populate: {
          path: 'user',
          model: 'user'
        }
      })
      .then((user) => {
        assert(user._id.toString() === joe._id.toString());
        assert(user.blogPosts[0].user._id.toString() === user._id.toString());
        done();
      });
  });

  it('saves a full relation graph', (done) => {
    User
      .findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        model: 'blogPost',
        populate: [{
          path: 'user',
          model: 'user'
        }, {
          path: 'comments',
          model: 'comment',
          populate: [{
            path: 'blogPost',
            model: 'blogPost'
          }, {
            path: 'user',
            model: 'user'
          }]
        }]
      })
      .then((user) => {
        assert(user._id.toString() === joe._id.toString());
        assert(user.blogPosts[0].user._id.toString() === user._id.toString());
        assert(user.blogPosts[0].comments[0].user._id.toString() === user._id.toString());
        assert(user.blogPosts[0].comments[0].blogPost._id.toString() === user.blogPosts[0]._id.toString())
        done();
      });
  });
});