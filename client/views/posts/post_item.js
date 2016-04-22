Template.postItem.helpers({
    domain: function() {
        var a = document.createElement('a');
        // Obtém o domínio do post atual
        a.href = this.url;
        return a.hostname;
    }
});