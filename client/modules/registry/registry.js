Template.registry.helpers({
    selectedRegistry: function(){
        return Session.get('registry:selected');
    }
});

Template.registry.events({
    'submit #create-new-registry': function (e, template) {

        e.preventDefault();

        var options = {
            from: Session.get('accounts:selected:address'),
            data: web3.bytecodes.securityRegistry,
            gas: 3000000
        };

        securityRegistryContract.new(options, onRegistryCreated);

    },
    'submit #create-new-security': function (e, template) {

        e.preventDefault();

        var account = Session.get('accounts:selected:address');
        var quant = parseInt(template.find("input[name=quantity]").value);
        var registry = Session.get('registry:selected:address');

        var options = {
            from: account,
            data: web3.bytecodes.security,
            gas: 3000000
        };

        securityContract.new(quant, registry, options, onSecurityCreated);

    }
});

/**
 * This method gets executed whenever new registry gets deployed to the blockchain.
 * @param err - Error object
 * @param contract - Contract object
 */
function onRegistryCreated(err, contract){

    if (err) {
        console.log(err.toString());
        return;
    }

    if (typeof contract.address != 'undefined') {
        console.log('Registry created: ' + contract.address);
        Session.set('registry:selected:address', contract.address);
    }

}

/**
 * This method gets executed whenever new security gets deployed to the blockchain.
 * @param err - Error object
 * @param contract - Contract object
 */
function onSecurityCreated(err, contract){

    if (err) {
        console.log(err.toString());
        return;
    }

    if (typeof contract.address != 'undefined') {
        console.log('Security created: ' + contract.address);
    }

}