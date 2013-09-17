/*
TDP013
Lab 3
server.js

Server-modul till Node.js-app

Hannah Börjesson & Per Jonsson IP2
2013-09

Skapar webserver, lyssna på port
*/

var http = require("http"); // för servern
var url = require("url"); // för parsning av request

// exports. markerar funktionens åtkomlighet utifrån
// route-funktionen ges av router.js, handle och mongo från main.js
exports.start = function(route, handle, mongo) {
    
  // Callback som skickas till createServer()
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    // handle-funktion mappar URL mot rätt funktion i requestHandler,
    // som vidarbefordrar requsetn till mongoDB-kopplingen
    // vidarebefordra också response- och requestobjekten i kedjan
    route(handle, pathname, request, response, mongo);
  }

  // Lyssna på angiven port, använd callback från ovan
  http.createServer(onRequest).listen(8000);
  console.log("Server has started, listening on port 8000.");
}


