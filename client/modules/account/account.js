Template.account.helpers({
    getBalance: function(address, currency){
        return web3.fromWei(
            web3.eth.getBalance(address), currency
        ).toString().concat(' ', currency);
    }
});

Template.account.events({
    'submit #edit-account-info': function(e, template){

        var account = Accounts.findOne({
            address: template.find("input[name=account-address-full]").value
        });

        Accounts.update(account._id, {
            $set: {
                name: template.find("input[name=account-name]").value
            }
        });

        e.preventDefault();

    }
});