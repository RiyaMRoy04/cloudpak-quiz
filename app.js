require('dotenv').config();
var cloudant = require('cloudant');
var express = require('express');
var bodyParser = require('body-parser');
var stringSimilarity = require('string-similarity');
var vcapServices = require('vcap_services');
var credentials = vcapServices.findCredentials({ service: 'cloudantNoSQLDB' });

var app = express();

var dbCredentials = {
    dbName: 'my_sample_db'
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  res.sendFile("views/index.html", {"root": __dirname});
});

var cloudant = cloudant({account:credentials.username, password:credentials.password});

var responsequiz1;
var responsequiz2;
var responsequiz3;
var responsequiz4;
var responsequiz5;
var time;
var url;
var counter=0;

cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

quizdb = cloudant.db.use(dbCredentials.dbName);


app.post('/quizsubmission', function(req,res){
    if(stringSimilarity.compareTwoStrings(req.body.quiz_1,'b')){
       counter++;
       }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_2,'d')){
        counter++;
    }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_3,'c')){
       counter++;
       }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_4,'c')){
        counter++;
    }
    if(stringSimilarity.compareTwoStrings(req.body.quiz_5,'b')){
       counter++;
       }
    var quizscore = counter;
    var doc={
        _id:req.headers.host + req.url,
        score:quizscore,
        responsequiz1: req.body.quiz_1,
        responsequiz2: req.body.quiz_2,
        responsequiz3: req.body.quiz_3,
        responsequiz4: req.body.quiz_4,
        responsequiz5: req.body.quiz_5,
        time: new Date().toISOString(),
        interested: req.body.interested
        };
    
quizdb.insert(doc,function(err,body,header){
    if(err){
        res.sendFile(__dirname + "/views/error.html");
        console.log('Error:'+err.message);
        return;
    }
    else{
        res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<center><h2>Thank you for taking the quiz!</h2><center>');   
    res.write('<center><h3>You have scored '+quizscore+'!</h3><center>');   
    res.end();
    }
});
    
    //return res.sendFile(__dirname+"/views/success.html");
});

const port = 3001;
app.listen(port, function () {
    console.log("Server running on port: %d", port);
});
module.exports = app;