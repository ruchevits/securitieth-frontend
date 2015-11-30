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
            data: '6060604052610128806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634f2be91f146100445780635893253c1461005357610042565b005b61005160048050506100cd565b005b6100696004808035906020019091905050610095565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060005060205280600052604060002060009150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b3360006000506000600160005054815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060016000818150548092919060010191905055505b56',
            gas: 3000000
        };

        securityRegistryContract.new(options, onRegistryCreated);

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