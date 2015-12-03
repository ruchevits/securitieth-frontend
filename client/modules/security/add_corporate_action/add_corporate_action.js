Template.addCorporateAction.rendered = function(){
    if (!this.rendered){
        Session.set('selected:corporate-action:type', '');
        this.rendered = true;
    }
};

Template.addCorporateAction.helpers({
    formTemplate: function(){
        var templates = {
            'spin-off': 'addSpinOffForm',
            'coupon': 'addCouponForm',
            'dividend': 'addDividendForm',
            'redemption': 'addRedemptionForm',
            'proxy-vote': 'addProxyVoteForm',
            'stock-split': 'addStockSplitForm'
        };
        return templates[Session.get('selected:corporate-action:type')];
    },
    notifications: function(){
        return Session.get('notifications');
    },
    currentState: function(address){
        return securityContract.at(address).currentState().toString();
    }
});

Template.addCorporateAction.events({
    'change #add-corporate-action [name=type]': function(e, template) {
        var type = template.find("[name=type]").value;
        var attributes = template.find(".action-attributes");
        Session.set('selected:corporate-action:type', type);
    },
    'submit #add-corporate-action': function(e, template){
        e.preventDefault();
        var type = Session.get('selected:corporate-action:type');
        addCorporateAction(type, template);
    }
});

Tracker.autorun(function () {

    var messages = [];

    switch (Session.get('selected:corporate-action:type')) {
        case '':
            messages.push({
                type: 'info',
                text: 'Please choose a corporate action type'
            });
            break;
    }

    Session.set('notifications', messages);

});

/**
 * Executes requested corporate action.
 * @param type - Corporate action type.
 * @param template - Template of the form.
 * @returns {Boolean} True if action added successfully, false otherwise.
 */
function addCorporateAction(type, template){

    var parent = template.find("[name=parent]").value;
    var ca = template.find("[name=state]").value;

    if (_.contains(['spin-off', 'coupon', 'dividend', 'redemption', 'stock-split'], type)){

        var rate = template.find("[name=rate]").value;

        // Check if rate value passed
        if (!rate){
            console.log('Rate not set');
            return false;
        }

        // Check if passed value is a string containing integer value
        if (!_.stringContainsInteger(rate)){
            console.log('Invalid rate');
            return false;
        }

    }

    switch (type) {

        case 'spin-off':
            var newShares = null;
            return addSpinOff(parent, newShares, rate, ca);

        case 'coupon':
            return addCoupon(parent, rate, ca);

        case 'dividend':
            return addDividend(parent, rate, ca);

        case 'redemption':
            return addRedemption(parent, rate, ca);

        case 'proxy-vote':
            return addProxyVote(parent, ca);

        case 'stock-split':
            return addStockSplit(parent, rate, ca);

    }

}

/**
 * TODO: Spin off.
 * @param {address} parent - Parent security.
 * @param {address} newShares
 * @param {uint} rate - Spin off ratio.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if spin off executed successfully, false otherwise.
 */
function addSpinOff(parent, newShares, rate, ca){
    console.log('Spin off security ' + parent + ' (new shares: ' + newShares + ', rate: ' + rate + ', ca: ' + ca + ')');
    return true;
}

/**
 * TODO: Add coupon.
 * @param {address} parent - Parent security.
 * @param {uint} rate - Coupon rate.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if coupon added successfully, false otherwise.
 */
function addCoupon(parent, rate, ca){

    console.log('Add coupon to security ' + parent + ' (rate: ' + rate + ', ca: ' + ca + ')');

    var options = {
        from: Session.get('accounts:selected:address'),
        data: '60606040526040516060806103a3833981016040528080519060200190919080519060200190919080519060200190919050505b82600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600160005081905550806002600050819055505b50505061031f806100846000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806305a7958e1461005a5780637a07ad0b14610093578063c0bcb26f146100b6578063c52ab778146100d957610058565b005b6100676004805050610103565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100a06004805050610132565b6040518082815260200191505060405180910390f35b6100c36004805050610129565b6040518082815260200191505060405180910390f35b610101600480803590602001909190803590602001909190803590602001909190505061013b565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016000505481565b60026000505481565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156101975761031a565b8273ffffffffffffffffffffffffffffffffffffffff1660006001600050548402604051809050600060405180830381858888f19350505050503373ffffffffffffffffffffffffffffffffffffffff16636bdedcf06002600050548585600003600260005054604051857c0100000000000000000000000000000000000000000000000000000000028152600401808581526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019450505050506000604051808303816000876161da5a03f115610002575050503373ffffffffffffffffffffffffffffffffffffffff16636bdedcf06002600050548585600160026000505401604051857c0100000000000000000000000000000000000000000000000000000000028152600401808581526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019450505050506000604051808303816000876161da5a03f115610002575050505b50505056',
        gas: 3000000
    };

    couponContract.new(parent, rate, ca, options, onCorporateActionCreated);

    return true;

}

/**
 * This method gets executed whenever new registry gets deployed to the blockchain.
 * @param err - Error object
 * @param contract - Contract object
 */
function onCorporateActionCreated(err, contract){

    if (err) {
        console.log(err.toString());
        return;
    }

    if (typeof contract.address != 'undefined') {
        console.log('Corporate action created: ' + contract.address);

        var security = securityContract.at(contract.parentSecurity());

        var options = {
            from: Session.get('accounts:selected:address'),
            gas: 4000000
        };

        security.addCorporateAction(contract.address, options, function(err, c){
            if (err) {
                console.log(err.toString());
            }
            console.log(c);
        });

        //securityContract.at(contract.parentSecurity()).addCorporateAction(contract.address);

        /*securityContract.at(contract.parentSecurity()).addCorporateAction.sendTransaction(contract.address, {
            from: Session.get('accounts:selected:address'),
            value: price,
            gas: 9000000
        });*/
    }

}

/**
 * TODO: Add dividend.
 * @param {address} parent - Parent security.
 * @param {uint} rate - Dividend rate.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if dividend added successfully, false otherwise.
 */
function addDividend(parent, rate, ca){
    console.log('Add dividend to security ' + parent + ' (rate: ' + rate + ', ca: ' + ca + ')');
    return true;
}

/**
 * TODO: Add redemption.
 * @param {address} parent - Parent security.
 * @param {uint} rate - Redemption rate.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if redemption added successfully, false otherwise.
 */
function addRedemption(parent, rate, ca){
    console.log('Add redemption to security ' + parent + ' (rate: ' + rate + ', ca: ' + ca + ')');
    return true;
}

/**
 * TODO: Add proxy vote.
 * @param {address} parent - Parent security.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if proxy vote executed successfully, false otherwise.
 */
function addProxyVote(parent, ca){
    console.log('Proxy vote for security ' + parent + ' (ca: ' + ca + ')');
    return true;
}

/**
 * TODO: Add stock split.
 * @param {address} parent - Parent security.
 * @param {uint} rate - Stock split ratio.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if stock split successfully, false otherwise.
 */
function addStockSplit(parent, rate, ca){
    console.log('Split stock for security ' + parent + ' (rate: ' + rate + ', ca: ' + ca + ')');
    return true;
}