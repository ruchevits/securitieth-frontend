Meteor.startup(function(){

    // Stop the application if Web3 provider is not set
    if (!web3.currentProvider){
        throw new Meteor.Error('web3-error', 'Can\'t connect to the Web3 provider');
    }

    // Watch blockchain for new blocks
    web3.eth.filter('latest').watch(function(err, blockHash){
        if (!err){
            Session.set('blocks:latest:number', blockHash);
        }
    });

    web3.eth.defaultRegistry = securityRegistry.address;

    Tracker.autorun(function () {
        Session.set('blocks:latest:number', web3.eth.blockNumber);
        Session.set('blocks:latest', getLatestBlock());
        Session.setDefault('accounts:selected:address', web3.eth.defaultAccount);
        Session.set('accounts', getAccounts());
        Session.setDefault('registry:selected:address', web3.eth.defaultRegistry);
        Session.set('registry:selected', getRegistry());
    });
});

/**
 * @returns {Number} Number of the latest mined block, or null
 */
function getLatestBlock(){

    //console.log('Retrieving latest block');

    var blockNumber = Session.get('blocks:latest:number');

    return blockNumber ? web3.eth.getBlock(blockNumber) : null;

}

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

/**
 * Returns an array of existing securities
 * @returns {Array} Registry of securities.
 */
function getRegistry(){

    var registry = securityRegistryContract.at(Session.get('registry:selected:address'));

    var securities = [];

    if (typeof Session.get('registry:selected:address') == 'undefined') return securities;

    var i = 0;

    while (true){
        var securityAddress = registry.registry(i);
        if (securityAddress == 0) break;
        var security = securityContract.at(securityAddress);

        var issuer = Accounts.findOne({
                address: security.issuer()
            }) || {};

        issuer.address = security.issuer();

        securities.push({
            address: security.address,
            issuer: issuer
        });
        i++;
    }

    return securities;

}