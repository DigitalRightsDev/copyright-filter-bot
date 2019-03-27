var express = require('express');
var fs = require('fs');
var app = express();

// Static files
app.set('view engine', 'ejs');
app.use('/favicon', express.static('favicon'));
app.use('/assets', express.static('assets'));
app.use('/logos', express.static('logos'));
app.use('/vids', express.static('vids'));
app.use('/pubkey', express.static('pubkey'));

app.get('/copyright-bot', function(req, res){
	var lang = req.headers['accept-language'];
	if(lang){
		lang = lang.split(';')[0].split(',')[1];
	}else{
		lang = 'en';
	}
	var langPath = 'lang/' + lang + '.js';
	if (!fs.existsSync(langPath)) {
    	langPath = 'lang/en.js'
	}
	var messages = JSON.parse(fs.readFileSync(langPath, 'utf8'));
	res.render('article13', {messages: messages});
});

app.get('/copyright-bot/:lang', function(req, res){
	var lang = req.params.lang;
	var langPath = 'lang/' + lang + '.js';
	if (!fs.existsSync(langPath)) {
    	langPath = 'lang/en.js'
	}
	var messages = JSON.parse(fs.readFileSync(langPath, 'utf8'));
	res.render('article13', {messages: messages});
});

app.get('/es', function(req, res){
	res.sendFile('./home-es.html',{
     root: __dirname
   });
});

app.get('/', function(req, res){
	res.sendFile('home-en.html',{
     root: __dirname
   });
});



app.listen(7777);
