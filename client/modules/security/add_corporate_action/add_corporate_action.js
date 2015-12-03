Template.addCorporateAction.rendered = function(){
    if (!this.rendered){
        Session.set('security:add-corporate-action:name', '');
        this.rendered = true;
    }
};

Template.addCorporateAction.helpers({
    security: function(){
        return Template.parentData(1);
    },
    addCorporateActionForm: function(){
        var templates = {
            'spin-off': 'addSpinOffForm',
            'coupon': 'addCouponForm',
            'dividend': 'addDividendForm',
            'redemption': 'addRedemptionForm',
            'proxy-vote': 'addProxyVoteForm',
            'stock-split': 'addStockSplitForm'
        };
        return templates[Session.get('security:add-corporate-action:name')];
    }
});

Template.addCorporateAction.events({
    'change #add-corporate-action [name=name]': function(e, template) {
        Session.set('security:add-corporate-action:name', template.find("[name=name]").value);
    },
    'submit #add-corporate-action': function(e, template){
        e.preventDefault();
        addCorporateAction(Session.get('security:add-corporate-action:name'), template);
    }
});

/**
 * Executes requested corporate action.
 * @param type - Corporate action type.
 * @param template - Template of the form.
 * @returns {Boolean} True if action added successfully, false otherwise.
 */
function addCorporateAction(type, template){

    var parent = template.find("[name=parent]").value;
    var state = Session.get('security:selected:state');

    // TODO: fix addCorporateAction logic in security contract
    // this is not safe at all
    // if for some reason corporate action is not created, the state will still increment
    // maybe it would be slightly better to block UI until the corporate action finishes
    // processing, but still - those who want, can do it through web3 directly
    Session.set('security:selected:state', parseInt(Session.get('security:selected:state')) + 1);

    if (_.contains(['spin-off', 'coupon', 'dividend', 'redemption', 'stock-split'], type)){

        var rate = template.find("[name=rate]").value;

        // Check if rate value passed
        if (!rate){
            console.log('Rate is not set');
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
            return addSpinOff(parent, newShares, rate, state);

        case 'coupon':
            return addCoupon(parent, rate, state);

        case 'dividend':
            return addDividend(parent, rate, state);

        case 'redemption':
            return addRedemption(parent, rate, state);

        case 'proxy-vote':
            return addProxyVote(parent, state);

        case 'stock-split':
            return addStockSplit(parent, rate, state);

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
    return false;
}

/**
 * Add coupon.
 * @param {address} parent - Parent security.
 * @param {uint} rate - Coupon rate.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if coupon added successfully, false otherwise.
 */
function addCoupon(parent, rate, ca){

    console.log('Add coupon to security ' + parent + ' (rate: ' + rate + ', ca: ' + ca + ')');

    var options = {
        from: Session.get('accounts:selected:address'),
        data: web3.bytecodes.coupon,
        gas: 3000000
    };

    couponContract.new(parent, rate, ca, options, onCorporateActionCreated);

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
    return false;
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
    return false;
}

/**
 * TODO: Add proxy vote.
 * @param {address} parent - Parent security.
 * @param {uint} ca - Corporate action number.
 * @returns {boolean} True if proxy vote executed successfully, false otherwise.
 */
function addProxyVote(parent, ca){
    console.log('Proxy vote for security ' + parent + ' (ca: ' + ca + ')');
    return false;
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
    return false;
}

/**
 * This method gets executed whenever new registry gets deployed to the blockchain.
 * @param err - Error object
 * @param corpAct - Contract object
 */
function onCorporateActionCreated(err, corpAct){
    if (err) {
        console.log(err.toString());
    }
    if (typeof corpAct.address != 'undefined') {
        bindCorporateAction(corpAct, securityContract.at(corpAct.parentSecurity()));
    }
}

function bindCorporateAction(corpAct, security){

    var options = {
        from: Session.get('accounts:selected:address'),
        gas: 4000000
    };

    security.addCorporateAction(corpAct.address, options, function(err){
        if (err) {
            console.log(err.toString());
        }
        Event.emit('corporate-action:created', {
            name: corpAct.name(),
            address: corpAct.address
        });
    });

}