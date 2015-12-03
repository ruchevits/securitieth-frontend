Template.securityCorporateActions.rendered = function(){
    if (!this.rendered){
        var security = Template.parentData(1);

        // Get corporate actions attached to the selected security
        Session.set('security:selected:corporate-actions', getCorporateActions(security.address));

        // Update corporate actions when a new one is created
        Event.on('corporate-action:created', function(corpAct){
            Session.set(
                'security:selected:corporate-actions',
                (Session.get('security:selected:corporate-actions')).concat(corpAct)
            );
        });

        this.rendered = true;
    }
};

Template.securityCorporateActions.helpers({
    corporateActions: function(){
        return Session.get('security:selected:corporate-actions');
    }
});

/**
 * Returns an array of corporate actions for the current security.
 * @param securityAddress - Security contract address.
 * @returns {Array} Array of corporate actions.
 */
function getCorporateActions(securityAddress){

    var actions = [];

    var i = 0;

    while (true){
        var actionAddress = securityContract.at(securityAddress).cAContracts(i);
        if (actionAddress == 0) break;
        var corpAct = corpActContract.at(actionAddress);
        actions.push({
            state: i,
            name: corpAct.name(),
            address: corpAct.address
        });
        i++;
    }

    return actions;

}