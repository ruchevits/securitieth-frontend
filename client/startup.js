Meteor.startup(function(){

    // Stop the application if Web3 provider is not set
    if (!web3.currentProvider){
        throw new Meteor.Error('web3-error', 'Can\'t connect to the Web3 provider');
    }

});

Tracker.autorun(function () {
    Session.setDefault('accounts:selected:address', web3.eth.defaultAccount);
    Session.set('accounts', getAccounts());
});

/**
 * Returns an array of currently unlocked accounts along with their local profiles (if exists).
 * Currently selected account is always first in the returned array.
 * @returns {Array} Unlocked accounts.
 */
function getAccounts(){

    var accounts = [];

    web3.eth.accounts.map(function(address){

        // Try to find the account profile
        var account = Accounts.findOne({
                "address": address
            }) || {};

        account.address = address;

        if (address == Session.get('accounts:selected:address')){
            accounts.unshift(account);
        } else {
            accounts.push(account)
        }

    });

    return accounts;

}