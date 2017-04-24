var express = require('express');
var app = express();
var http = require('http');
var output = {"ip_address": "",
               "language": "",
               "software": ""
};

app.get('/', function (req, res) {
    
  console.log('IP = ', req.ip);
  console.log('x-forwarded-for ', req.headers['x-forwarded-for']);
  console.log('remoteaddress ', req.connection.remoteAddress);
  console.log('OS ', req.headers['user-agent']);
  console.log('lng ', req.headers['accept-language']);
  
  output.ip_address = req.ip;
  output.language = getLanguage(req.headers['accept-language']);
  output.software = getSoftware(req.headers['user-agent']);
  var x = JSON.stringify(output);
  res.send(x);
  
  
//   res.send('Hello World, welcome to IP address microservice !');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("IP, Language, Operating System microservice has started!");
});

function getLanguage(lang){
    var language = "";
    var delimiter = ',';
    var delimiterPos = Number(lang.indexOf(delimiter));
    if (delimiterPos !== -1){
         language = lang.substr(0, delimiterPos);
    } else {
        language = lang;
    }
   
    console.log(language);
    return language;
}

function getSoftware(input){
    var output = [];
    var open = '(';
    var close = ')';
    var instances = (input.match(/\(/g) || []).length;
    var posOpen = Number(input.indexOf(open));
    var posClose = Number(input.indexOf(close));
    var x = input.substr(posOpen + 1, posClose - posOpen - 1);
    output.push(x);
    
    if (instances > 1){
        while(posOpen !== -1){
            posOpen = input.indexOf(open, posOpen + 1);
            posClose = input.indexOf(close, posClose + 1);
            x = input.substr(posOpen + 1, posClose - posOpen - 1);
            output.push(x);
        }
    }
    return output[0];
}