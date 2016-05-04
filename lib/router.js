Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { 
        return [Meteor.subscribe('notifications')]; 
    }
});

PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 5,
    limit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: {submitted: -1}, limit: this.limit()};
    },
    waitOn: function() {
        return Meteor.subscribe('posts', this.findOptions());
    },
    posts: function() {
        return Posts.find({}, this.findOptions());
    },
    data: function() {
        // this.posts().count() aqui se refere ao cursor atual, ou seja, quando posts foram carregados 
        // na última busca ao server
        var hasMore = this.posts().count() === this.limit();
        var nextPath = this.route.path({postsLimit: this.limit() + this.increment});
        return {
            posts: Posts.find({}, this.findOptions()),
            nextPath: hasMore ? nextPath : null
        };
    }
});

Router.map(function() {
    this.route('postPage', {
        path: '/posts/:_id',
        waitOn: function() {
            return [
                Meteor.subscribe('singlePost', this.params._id),
                Meteor.subscribe('comments', this.params._id)
            ]
        },
        data: function() { return Posts.findOne(this.params._id); }
    });
    this.route('postEdit', {
        path: '/posts/:_id/edit',
        waitOn: function() {
            return Meteor.subscribe('singlePost', this.params._id);
        },
        data: function() { return Posts.findOne(this.params._id); }
    });
    this.route('postSubmit', {
        path: '/submit',
        progress : false
    });
    this.route('postsList', {
        path: '/:postsLimit?',
        controller: PostsListController
    });
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()){
            this.render(this.loadingTemplate)
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction(requireLogin, {only: 'postSubmit'});