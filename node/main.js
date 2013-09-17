/*
TDP013
Lab 2
main.js
Huvudmodul till Node.js-appen
Hannah Börjesson & Per Jonsson IP2
2013-09

(Ev. måste processen $ mongod köras först)
Körning (förutsätter Node.js installerat):
$ node main.js

=> Öppna webbläsare på localhost:XXXX/anrop?key=value

Körs i oändlighet tills fel uppstår eller användaren avbryter med Ctrl+C
*/

// importera alla våra samarbetsmoduler
var server = require('./server');
var router = require("./router");
var requestHandler = require("./requestHandler");
var mongo = require('./mongo');


// Skapa associativ array där vi mappar begärd URL mot funktion i requestHandler
var rHandle = {};
rHandle["/save"] = requestHandler.save;
rHandle["/flag"] = requestHandler.flag;
rHandle["/getall"] = requestHandler.getall;

// Mongo-modulen ska sedan ta ansvar för att interagera med databasen
var mHandle = {};
mHandle["/save"] =  mongo.save;
mHandle["/flag"] =  mongo.flag;
mHandle["/getall"] = mongo.getall;


// Kör igång appen genom att starta servern och lyssna efter inkommande requests
server.start(router.route, rHandle, mHandle); 


