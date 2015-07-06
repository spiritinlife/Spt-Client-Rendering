var express = require('express'),
		app = express(),
		spt = require('./spt/spt.js'),
		serveStatic = require('serve-static'),
		blocked = require('blocked'),
		path = require('path')


blocked(function(ms){
  console.log('BLOCKED FOR %sms', ms | 0)
});

//app.use(serveStatic(__dirname))
app.use(spt(path.join(__dirname,"public")))


app.get('/', function (req, res) {
  res.sptRender('index', {title : "Cool site", manymessages:['a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a'],thisIsTrue: false,message : 'Hellp',messages:['sdsd','aaaa','aaaa','aaaa','aaaa']});
})


app.use(function(err, req, res, next) {
    if(!err) return next(); // you also need this line
    console.log(err);
    res.status(404).end("The request you made is on our wanted list!");
});

app.listen(8080,'127.0.0.1',function(){
	console.log('server listening')
})