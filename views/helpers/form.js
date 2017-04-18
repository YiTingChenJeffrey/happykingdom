const Handlebars = require('handlebars');


Handlebars.registerHelper('list', function (context, options) {
    var ret = "";
    var parsing = JSON.parse(context);
    console.log("parsing= " + parsing);
    for (var keys in parsing) {
        console.log(keys + " => " + parsing[keys])
        ret = ret + keys + " => " + parsing[keys] + ", ";
    };

    return ret;


});

Handlebars.registerHelper('style', function (context, options) {
    var ret = "";
    var parsing = JSON.parse(context);
    console.log("parsing= " + parsing);
    for (var keys in parsing) {
        console.log(keys + " => " + parsing[keys]);
        var styling = '<div id="' + keys + '">' + parsing[keys] + '</div>' + "\r\n";
        ret = ret + styling;
    };

    return ret;


});

Handlebars.registerHelper('all', function (context, options) {
    var ret = "";
    var parsing = JSON.parse(context);
    console.log(context);
    for (var i=0;i<parsing.length;i++) {
        ret = ret + options.fn(parsing[i]);
    };
    return ret;


});


//Handlebars.registerHelper('list', function (context, options) {
//        var ret = "<ul>";
//
//        for (var i = 0, j = context.length; i < j; i++) {
//            ret = ret + "<li>" + options.fn(context[i]) + "</li>";
//        }
//
//        return ret + "</ul>";
//    });
