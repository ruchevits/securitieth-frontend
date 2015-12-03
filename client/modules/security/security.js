Template.security.helpers({

    actions: function(){
        return [];
    },

    isIssuer: function(address){
        return securityContract.at(address).issuer() == Session.get('accounts:selected:address');
    },

    balance: function(address){
        return parseInt(
            securityContract.at(address).balances(Session.get('accounts:selected:address')).toString()
        );
    }

});