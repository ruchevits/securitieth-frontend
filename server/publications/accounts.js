Meteor.publish('accounts', function() {
    return Accounts.find({});
});