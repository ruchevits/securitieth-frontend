Template.registerHelper('shortAddress', function(address) {
    if (address){
        return address.substring(0,12);
    }
});