Template.navbar.helpers({
    accounts: function () {
        return Session.get('accounts');
    }
});

Template.navbar.events({
    'click #navbar-account-menu .account-secondary': function(e){
        Session.set('accounts:selected:address', $(e.currentTarget).find('.addr').text());
    }
});