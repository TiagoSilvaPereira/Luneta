// Adiciono um helper para o template postsList
Template.postsList.helpers({
    posts: function() {
        return Posts.find();
    }
});