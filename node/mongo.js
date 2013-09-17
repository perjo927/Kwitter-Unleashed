/*
TDP013
Lab 3
mongo.js

Interaktion med databasen, mongoDB

Hannah Börjesson & Per Jonsson IP2
2013-09

Installation:
$ npm install mongodb
(stå i roten i projektmappen)

Skapa defaultmapp för databasen
$ sudo -p mkdir /data/db
$ sudo chmod 0755 /data/db  alt. $ sudo chown $USER /data/db

(Kör ev. igång processen mongod för att kunna få access till databasen)
Starta tjänsten (innan $ node main.js): 
$mongod

För att skapa databasen i shell-läge
$ mongo
> use kwitter
> db.messages.insert({key:value}); // skapa
> db.messages.remove(); // nollställ
> db.messages.drop() // tar bort helt och hållet

Öppna http://localhost:28017/ ( = portnr + 1000) i webbläsaren för mer info 
*/

var mongoDB = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // hjälper oss koppla upp
var mongo; // kopplingen till databasen


// Begär insyn i databasen 'kwitter' i /data/db
MongoClient.connect('mongodb://127.0.0.1:27017/kwitter', function(err, db) {
    if(err) throw err;
    console.log("Connected to mongodb/kwitter");
    
    // kopplingen till databasen
    mongo = db;
    
    // I databasen 'kwitter' ska finnas en samling 'messages'
    // {w:1} leverar ev. felmeddelande, strict kollar att collection ej finns,
    // safe(safe:true) mode är på by default, generar collection automatiskt
    mongo.collection('messages', {w:1, strict:true}, function(err, collection) {
        if (err) {
            console.log(
                "The 'messages' collection doesn't exist, it will now be created:",
                err);
        }
    });
})


// KRAV: Spara meddelanden
// Pathname: /save , metod: GET	, Meddelande - max 140 tecken, Svar: HTTP 200
exports.save = function(msg, createResponse, response) {
    // Försök lägga till meddelandet i databasens collection 'messages'
    mongo.collection('messages', {w:1}, function(err, collection) {
        if (err) throw err;
        
        // skapa omarkerat msg
        var doc = {'msg': msg, flag:false}; 
        
        collection.insert(doc, function(err, result) {
            if (err) throw err;
	    console.log("Inserted: " + msg + " in the database");
            
            // Skicka tillbaka objekt-ID
            createResponse(response, 200, result[0]._id.toString());
	});
    });         
}

// KRAV: Markera som läst
// Pathname: /flag , Metod: GET , Svar: HTTP 200
exports.flag = function(id, createResponse, response) {    
    // Måste passa formatet, typ: 5230485bacb094e20c000001'
    var objectId = new mongoDB.BSONPure.ObjectID.createFromHexString(id);
    
    mongo.collection('messages', function(err, collection) {
        collection.findAndModify(
            { _id : objectId}, // query
            {rating:1}, // sortering
            {$set: {flag: true}}, //markera som läst
            {}, // options
            function(err, object) {
                if (err) throw err;
                if (!(object===null)) {
                    console.log(
                   "Change of flag succesful for object with ID:"
                    + objectId);
                    createResponse(response, 200, "");
                } 
            });

    });
}


// KRAV: Hämta alla meddelanden
// Sökväg: /getall , Metod: GET , Svar: (JSON)
// => [{msg: '', flag: false}, {'msg: '', flag: true}, ...]
exports.getall = function(response, createResponse) {    
    // Gå in i samlingen av meddelanden
    mongo.collection('messages', function(err, collection) {
        if (err) {
            console.log("'messages' collection didn't exist");
        } else {            
            // Spara allt i en array
            collection.find().toArray(function(err, results) {

	        // konvertera till JSON
                var jsonString = JSON.stringify(results);
                console.dir("Converted db collection to JSON string: " + jsonString);
                // Modifiera response-objektet härifrån
                createResponse(response, 200, jsonString);
            });
        }
    });
}
