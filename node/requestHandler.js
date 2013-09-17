/*
TDP013
Lab 3
requestHandler.js

Request handler-modul till Node.js-app

Hannah Börjesson & Per Jonsson IP2
2013-09

Specifierar vad som ska göras när en viss URL är begärd
CORS används till response
*/

var url = require("url");

// KRAV: Spara meddelanden
// Sökväg: /save , metod: GET ,
// Parameter: Meddelande: max 140 tecken, Svar: HTTP 200
exports.save = function(request, response, mongo) {
    console.log("Request handler 'save' was called."); 

    // Försök sätta in meddelandet i vår collection
    modifyDB(request, response, mongo, 'msg');
}

// KRAV: Markera som läst
// Sökväg: /flag , Metod: GET , Parameter: ID  , Svar:	HTTP 200
exports.flag = function(request, response, mongo) {
    console.log("Request handler 'flag' was called.");

    // Försök flagga rätt ID till true i vår collection
    modifyDB(request, response, mongo, 'ID');
}

// KRAV: Hämta alla meddelanden:
// Sökväg: /getall , Metod: GET, Svar: JSON-objekt 
// => [msg: '', flag: false}, {msg: '', flag: true}, ...]
exports.getall = function(request, response, mongo) {
    console.log("Request handler 'getall' was called.");

    // Begär ut ett JSON-objekt, som motsvarar hela databasen
    // skapa responsen i mongo.js-funktionen
    mongo(response, createResponse);
    
}

function modifyDB(request, response, mongo, key) {
    // Parsa parametern från requesten
    // form: localhost:XXXX/pathname?parameter=value
    var urlParts = url.parse(request.url, true);
    console.log("urlParts.query: ", urlParts.query);
    var parameter = urlParts.query[key];

    // Finns parametern?
    if (parameter) {
        // Spara isf i db
        mongo(parameter, createResponse, response);
    } else {
        // Någonting gick snett
        createResponse(response, 400, "");
    }
}

function createResponse(response, code, body){
        // Den här biten lägger till CORS-funktionalitet
    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] =
        "POST, GET, PUT, DELETE, OPTIONS";
    // Här gör vi som förut
    response.writeHead(code, headers);    
    console.log("HTTP " + code);
    response.write(body); 
    response.end();
}
