Template.registerHelper('shortAddress', function(address) {
    if (address){
        return address.substring(0,12);
    }
});

Template.registerHelper('userName', function(name) {
    return name ? name : 'Anonymous';
});