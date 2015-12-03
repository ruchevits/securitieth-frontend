Template.corporateAction.helpers({
    balance: function(){
        // Needed so that the value be updated reactively
        Session.get('blocks:latest:number');

        var security = Template.parentData(1);
        var action = this;

        return parseInt(
            securityContract.at(security.address).balances(
                Session.get('accounts:selected:address'), action.state
            )
        );
    }
});

Template.corporateAction.events({
    'submit #run-corporate-action': function(e, template){
        e.preventDefault();
        var security = Template.parentData(1);
        var action = this;

        runCorporateAction(security, action, template);
    }
});

function runCorporateAction(security, action, template){

    var amount = template.find("[name=amount]").value;
    var state = action.state;
    var extra = null;

    var options = {
        from: Session.get('accounts:selected:address'),
        gas: 4000000
    };

    securityContract.at(security.address).runCA(amount, state, extra, options, function(err, hash){
        if (err) {
            console.log(err.toString());
        }
        if (hash != 'undefined'){
            Event.emit('corporate-action:executed', {
                name: action.name,
                address: action.address,
                amount: amount
            });
        }
    });

}