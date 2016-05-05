Posts = new Meteor.Collection('posts');

Posts.allow({
    update: ownsDocument,
    remove: ownsDocument
});

Posts.deny({
    update: function(userId, post, fieldNames) {
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

Meteor.methods({
    post: function(postAttributes) {
        var user = Meteor.user();

        if(!user)
            throw new Meteor.Error(401, 'You need to login to post new stories');

        if(!postAttributes.title)
            throw new Meteor.Error(422, 'Please fill in a headline');

        var postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
          return {
            postExists: true,
            _id: postWithSameLink._id
          }
        }

        var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {
          _id: postId
        };

    },

    upvote: function(postId) {
        var user = Meteor.user();
        if(!user)
            throw new Meteor.Error(401, "You need to login to upvote");

        // Faz o upddate se encontrar um post com esse id onde o usuário ainda não votou ($ne)
        Posts.update({
            _id: postId,
            upvoters: {$ne: user._id}
        }, {
            $addToSet: {upvoters: user._id},
            $inc: {votes: 1}
        });

    }
});