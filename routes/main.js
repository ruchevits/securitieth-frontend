Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: "loading",
    notFoundtemplate: "notFound",
    waitOn: function(){
        return [
            this.subscribe('accounts').wait()
        ]
    }
});