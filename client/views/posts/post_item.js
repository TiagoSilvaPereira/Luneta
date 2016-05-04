Template.postItem.helpers({
    ownPost: function() {
        return this.userId == Meteor.userId();
    },
    domain: function() {
        var a = document.createElement('a');
        // Obtém o domínio do post atual
        a.href = this.url;
        return a.hostname;
    }
});