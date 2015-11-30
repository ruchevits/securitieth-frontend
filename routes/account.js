Router.route('/account/:address', {
    name: 'account',
    template: 'account',
    data: function() {

        var address = this.params.address;
        var isUnlocked = _.contains(web3.eth.accounts, address);

        // If account is not unlocked at current client
        if (!isUnlocked){
            this.render("accountNotFound", {
                data: function() {
                    return {
                        address: address
                    }
                }
            });
            return {
                error: {
                    code: 1,
                    message: 'Account not available'
                }
            }
        }

        var account = Accounts.findOne({
            address: address
        });

        return account ? account : {
            error: {
                code: 2,
                message: 'Account not found'
            }
        };

    },
    onBeforeAction: function() {

        var data = this.data();

        if (data && data.error && data.error.code == 2) {
            Accounts.insert({
                address: this.params.address,
                updatedAt: new Date()
            });
        }

        this.next();

    }
});