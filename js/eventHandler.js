/*
  TDP013
  Laboration 3
  eventHandler.js 
  Per Jonsson, Hannah Börjesson IP2
  perjo927     hanbo174

  Ny jQuery-funktionalitet har lagts till sedan Lab 1.
  Vi utnyttjar de tidigare funktionerna definierade i kwitter.js, och tar hand om alla
  events i det här skriptet.
  
  Ser till så att de olika typerna anrop kopplas till rätt funktionalitet:
  Hämta meddelanden, spara meddelanden, markera meddelanden
  Vi använder AJAX-anrop.
*/

$(document).ready(function() {

    // Varje gång sidan laddas (.ready()!), gör följande:
    // Hämta alla meddelanden från mongoDB genom nedanstående asynkrona request
    $.ajax(
        {url:"http://localhost:8000/getall", dataType:'json',
         success:function(json) {
             
             for(var i in json){
                 createTweet(json[i].msg, json[i]._id, json[i].flag);
             }
         },
         error:function(req,data,err) {
             console.log(err);
         }}); 

    // "Kvittra" -knappen 
    $("#button").click(function(){
        // Kod från Lab 1 - kollar att tweeten är ok,
        if (validateInput()) {
            // Lab1-kod skickar iväg tweeten i trädet, vi fångar texten
            var tweetmsg = createTweet("", "", false); 
                       
           
            // Skapa asynkron AJAX-request för att spara meddelande i mongoDB 
            $.ajax(
                {url : 'http://localhost:8000/save', 
                 data : { 'msg': tweetmsg.text }, // parametrar i url:en
                 statusCode: {200: function() {
                     // Kolla att vi får 200 från servern
                     console.log("Meddelande sparat");
                 }},
                 success:function(responseData) {
                     // Vi vill associera varje sparad tweet i trädet
                     // med ett unikt ID från mongoDB när vi "flaggar"
                     var title = responseData;
                     tweetmsg["container"].title = title;
                 },
                 error:function(req,data,err) {
                     console.log(err);
                 }
                });
        }
    });
    
    // Återställ textarean när man klickar på den (återanvänder kod från Lab 1)
    $("#textarea").click(function() { resetText(); });


    // Utöka funktionen från kwitter.js som har hand om checkbox-event
    var oldMarkAsRead = markAsRead;

    markAsRead = function() {
        oldMarkAsRead.apply(this, arguments);
        

        // Skapa asynkron AJAX-request för att spara meddelande i mongoDB 
        $.ajax(
            {url : 'http://localhost:8000/flag', 
             data : { 'ID': hexvalue }, // hexval här
             statusCode: {200: function() {
                 console.log("Checkbox set the flag to true");
             }},
             success:function(result) {},
             error:function(req,data,err) {
                 console.log(err);
             }
            });       
    }
    
});
