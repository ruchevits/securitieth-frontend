Router.route('/security/:address', {
    name: 'security',
    template: 'security',
    data: function() {

        var address = this.params.address;

        var foundSecurity = _.find(Session.get('registry:selected'), function(security) {
            return  security.address == address;
        });

        // If security with provided address doesn't exist in the registry
        if (!foundSecurity){
            this.render("securityNotFound", {
                data: function() {
                    return {
                        address: address
                    }
                }
            });
            return {
                error: {
                    code: 1,
                    message: 'Security not found'
                }
            }
        }

        return foundSecurity;

    },
    onBeforeAction: function() {

        this.next();

    }
});