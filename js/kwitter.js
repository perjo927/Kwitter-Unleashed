/*
  TDP013
  Laboration 3
  kwitter.js
  Per Jonsson, Hannah Börjesson IP2
  perjo927     hanbo174

  Ser till så att meddelanden är korrekt skrivna innan de
  skickas iväg. Ser till så att meddelanden läggs till på rätt ställe.
*/

var newMsg = "";

var validateInput = function()
{
    var reset = "";
    var errorMsg = "Ditt inlägg måste vara mellan 1 och 140 tecken"; // KRAV
    var tweetLength = document.getElementById("textarea").value.length;
    var invalidTweet = (tweetLength == 0 || tweetLength > 140);
       
    // Skicka felmeddelande om tweeten är felaktig (KRAV), annars återställ
    document.getElementById("error").innerHTML = (invalidTweet) ? errorMsg : reset;
    // Skicka tweeten om den är giltig
    if (!(invalidTweet)) { return true; } else { return false; }
};

var createTweet = function(dbTweet = "", id = "", flag = false)
{
    // Hämta innehållet till tweet:en från databas eller textarea?
    var tweetElem =  document.getElementById("textarea");
    var docTweet =  tweetElem.value;
    var tweet = (dbTweet === "") ? docTweet : dbTweet;
    // Skapa behållare till tweet
    var tweetDiv = document.createElement("div");
    tweetDiv.id = "tweetmsg";
    // Vi vill ha ett unikt ID från mongoDB när sidan laddas om
    if (!(id === "")) { tweetDiv.title = id; }
    // Skapa ny tweet-text 
    var msgNode = document.createTextNode(tweet);
    // Lägg till texten till div:en
    tweetDiv.appendChild(msgNode);
    // Skapa knapp för att markera läst text
    var disableButton = document.createElement("input");
    disableButton.type = "checkbox";
    disableButton.id = "checkbox";

    
    // Lägg knappen bredvid tweet:en
    tweetDiv.appendChild(disableButton);
    // Gör så att man kan markera den som oläst också
    disableButton.onclick = markAsRead;
    // Sätt som läst direkt om vi hämtar från databasen och 'flag':true
    if (flag) {markAsReadFromDB(tweetDiv);}
    
    // Infoga meddelandena
    // KRAV: Tweets ska visas i ordningen "senast först"
    var tweets = document.getElementById("tweet");
    tweets.insertBefore(tweetDiv, tweets.childNodes[0]);
    
    // Återställ textarean efter varje tweet
    var textarea = document.getElementById("textarea");
    textarea.value = "Sjung ut!";

    // Skicka vidare tweeten, och dess behållare
    return {"container": tweetDiv, "text": tweet}; 
};

var resetText = function()
{
    // Gör textrutan tom
    var reset = "";
    document.getElementById("textarea").value = reset;
};

var markAsRead = function(event)
{
    // Markera som läst och ta bort knappen
    // KRAV: Det ska vara tydlig skillnad mellan lästa/olästa tweets
    var node = event.target.parentNode;
    node.style.opacity = "0.2";
    node.removeChild(node.childNodes[1]);
    // Det unikva värdet för varje tweet i mongoDB / DOM-trädet
    hexvalue = node.title;
};

var markAsReadFromDB = function(div)
{
    // Markera som läst och ta bort knappen
    // KRAV: Det ska vara tydlig skillnad mellan lästa/olästa tweets
    div.style.opacity = "0.2";
    div.removeChild(div.childNodes[1]);
};
