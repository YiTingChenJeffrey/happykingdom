'use strict';
const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');
const fs = require("fs");
const Sequelize = require('sequelize');
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

var sequelize;

server.connection({
    port: (process.env.PORT || 3000)
});


if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: true //false
    })
} else {

var sequelize = new Sequelize('db', 'username', 'password', {
    host: 'localhost'
    , dialect: 'sqlite'
    , pool: {
        max: 5
        , min: 0
        , idle: 10000
    }, // SQLite only
    storage: 'db.sqlite'
});
}
    
var Formsubmit = sequelize.define('formsubmit', {
    storeName: {
        type: Sequelize.STRING
    }
    , storeAddress: {
        type: Sequelize.STRING
    }
    , storeCity: {
        type: Sequelize.STRING
    }
    , storeDescription: {
        type: Sequelize.STRING
    }
    , approved: {
        type: Sequelize.BOOLEAN
        , defaultValue: false
    }
});
server.register([Blipp, Inert, Vision], () => {});
server.views({
    engines: {
        html: Handlebars
    }
    , path: 'views'
    , layoutPath: 'views/layout'
    , layout: 'layout'
    , helpersPath: 'views/helpers', //partialsPath: 'views/partials'
});
server.route({
    method: 'GET'
    , path: '/'
    , handler: {
        view: {
            template: 'Homepage'
        }
    }
});
server.route({
    method: 'GET'
    , path: '/donation'
    , handler: {
        view: {
            template: 'Donation'
        }
    }
});
server.route({
    method: 'GET'
    , path: '/contact'
    , handler: {
        view: {
            template: 'Contact'
        }
    }
});

server.route({
    method: 'GET'
    , path: '/form'
    , handler: {
        view: {
            template: 'Form'
        }
    }
});

server.route({
    method: 'GET'
    , path: '/detailedinfo/{id}'
    , handler: function (request, reply) {
        Formsubmit.findOne({
            where: {
                id: encodeURIComponent(request.params.id)
            }
        }).then(function (d) {
            var parsing = JSON.stringify(d);
            //console.log(parsing);
            reply.view('DetailedInfo',{
                dbresponse: parsing
            });
    });
    }
    
    });

server.route({
    method: 'GET'
    , path: '/address'
    , handler: function (request, reply) {
        Formsubmit.findAll({
            where: {
                approved: true
            }
        }).then(function(d){
            var parsing = JSON.stringify(d);
            console.log(parsing);
            reply.view('Address',{
                dbresponse: parsing
            });
        })
    }
});
server.route({
    method: 'GET'
    , path: '/{param*}'
    , handler: {
        directory: {
            path: './'
            , listing: false
            , index: false
        }
    }
});

//server.route({
//
//    method: 'POST',
//    path: '/imageUpload',
//    config: {
//
//    payload: {
//            output: 'file',
//            parse: true,
//            //allow: 'multipart/form-data'
//        }
//    },
//    handler: function (request, reply) {
//
//        var data = request.payload;
//        var name = data["fileUpload"].filename;
//        console.log(data);
//        if (name != "") {
//
//            fs.readFile(data["fileUpload"].path, function (err, data) {
//                var path = __dirname + "/public/uploads/" + name;
//                fs.writeFile(path, data, name, function (err) {
//
//                    //need to fix bug
////                    reply.view('imageuploaded', {
////                        uploaded: str(name)
////                    })
//                    console.log("Saved");
//                });
//            });
//
//        } else {
//            reply().redirect("/");
//        };
//    }
//});

server.route({
    method: 'POST'
    , path: '/form1'
    , handler: function (request, reply) {
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //console.log(parsing);
        Formsubmit.create(parsing).then(function (Love1) {
            Formsubmit.sync();
            console.log("...syncing");
            console.log(Love1);
            return (Love1);
        }).then(function (Love1) {
            reply.view('formresponse', {
                formresponse: Love1
            });
        });
    }
});
server.route({
    method: 'GET'
    , path: '/find/{storeName}'
    , handler: function (request, reply) {
        Formsubmit.findOne({
            where: {
                storeName: encodeURIComponent(request.params.storeName)
            , }
        }).then(function (user) {
            var currentUser = "";
            currentUser = JSON.stringify(user);
            //console.log(currentUser);
            currentUser = JSON.parse(currentUser);
            console.log(currentUser);
            reply.view('find', {
                dbresponse: currentUser
            });
        });
    }
});
server.route({
    method: 'GET'
    , path: '/createDB'
    , handler: function (request, reply) {
        // force: true will drop the table if it already exists
        Formsubmit.sync({
            force: true
        });
        reply("Database Created");
    }
});
server.route({
    method: 'GET'
    , path: '/getdata'
    , handler: function (request, reply) {
        var data = {};
        Formsubmit.findAll().then(function (d) {
            data = JSON.stringify(d);
            reply(data);
        });
    }
});
server.route({
    method: 'GET'
    , path: '/displayAll'
    , handler: function (request, reply) {
        Formsubmit.findAll().then(function (users) {
            var allUsers = JSON.stringify(users);
            //            console.log(allUsers);
            reply.view('dbresponse', {
                dbresponse: allUsers
            });
        });
    }
});
server.route({
    method: 'GET'
    , path: '/delete/{id}'
    , handler: function (request, reply) {
        Formsubmit.destroy({
            where: {
                id: encodeURIComponent(request.params.id)
            }
        });
        reply().redirect("/displayAll");
    }
});
server.route({
    method: 'GET'
    , path: '/approve/{id}'
    , handler: function (request, reply) {
        Formsubmit.findOne({
            where: {
                id: encodeURIComponent(request.params.id)
            }
        }).then(function (d) {
            var parsing = JSON.parse(JSON.stringify(d));
            parsing.approved = true;
//            console.log(parsing);
            Formsubmit.update(parsing, {
                where: {
                    id: parsing.id
                }
            });
        });
        reply().redirect("/displayAll");
    }
});
server.route({
    method: 'GET'
    , path: '/update/{id}'
    , handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);
        reply.view('Update', {
            routeId: id
        });
    }
});
server.route({
    method: 'POST'
    , path: '/update/{id}'
    , handler: function (request, reply) {
        var cm = "";
        var id = encodeURIComponent(request.params.id);
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //console.log(parsing);
        Formsubmit.update(parsing, {
            where: {
                id: id
            }
        });
        reply().redirect("/displayAll");
    }
});
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});