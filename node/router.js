/*
TDP013
Lab 3
router.js

Router-modul till Node.js-app

Hannah Börjesson & Per Jonsson IP2
2013-09

Ser till så att rätt funktioner anropas för en given URL
och att vidarebefordring sker, samt felkontroll
*/

var url = require("url");

exports.route = function(handle, pathname, request, response, mongo) {
    console.log("About to route a request for " + pathname);

    try {
        // Metod måste vara GET
        if (!checkGET(request)) {
            response.writeHead(405, {'Content-Type':'text/plain'}); 
            //response.write("HTTP Error: 405 Method not allowed (expected GET)");
            response.end();
            console.log("HTTP 405");
        }
        // Sökväg måste motsvaras av en funktion
        else if (typeof handle[pathname] === 'function') {
            handle[pathname](request, response, mongo[pathname]);
        } else {
            console.log("No request handler found for " + pathname);
            console.log("HTTP 404");

            response.writeHead(404, {"Content-Type": "text/plain"});
            //response.write("HTTP Error: 404 Not found (pathname incorrect)");
            response.end();
        }
    } catch(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        //response.write("HTTP Error: 500 Unexpected condition");
        response.end();
    }
}

function checkGET(request) {
    var httpMethod = url.parse(request.method, true);
    var method = httpMethod.pathname;
    return (method === 'GET');
}
        
