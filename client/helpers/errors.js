// Essa coleção existe apenas no cliente e não possui nome. Armazena os erros
Errors = new Meteor.Collection(null);

throwError = function(message) {
    Errors.insert({message: message});
}