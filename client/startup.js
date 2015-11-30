Meteor.startup(function(){

    // Stop the application if Web3 provider is not set
    if (!web3.currentProvider){
        throw new Meteor.Error('web3-error', 'Can\'t connect to the Web3 provider');
    }

});