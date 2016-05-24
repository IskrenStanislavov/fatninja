define(function(require){
    require("js/hardCodeConfig");
    var Loader          = require("libs/loader");

    return function(onComplete){
        new Loader({
            resources:Object.values(resources),
            onComplete: onComplete
        });
    };
});
