Template.security.rendered = function(){
    if (!this.rendered){
        var security = this.data;
        Session.set('security:selected:state', getCurrentState(security));
        this.rendered = true;
    }
};

Template.security.helpers({
    isIssuer: function(){
        return this.issuer.address == Session.get('accounts:selected:address');
    }
});

function getCurrentState(security){
    console.log('getCurrentState');
    return securityContract.at(security.address).currentState().toString();
}