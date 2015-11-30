Template.addCorporateAction.rendered = function(){
    if (!this.rendered){
        Session.set('selected:ca', '');
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
        return templates[Session.get('selected:ca')];
    },
    notifications: function(){
        return Session.get('notifications');
    }
});

Template.addCorporateAction.events({
    'change #add-corporate-action [name=type]': function(e, template) {
        var type = template.find("[name=type]").value;
        var attributes = template.find(".action-attributes");
        Session.set('selected:ca', type);
    },
    'submit #add-corporate-action': function(e, template){
        e.preventDefault();
        var type = Session.get('selected:ca');
        addCorporateAction(type, template);
    }
});

Tracker.autorun(function () {

    var messages = [];

    switch (Session.get('selected:ca')) {
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
    var ca = null;

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
    return true;
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