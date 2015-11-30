_.mixin({
    'stringContainsInteger' : function(str) {
        var n = ~~Number(str);
        return String(n) === str && n >= 0;
    }
});