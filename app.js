var express = require("express"),
	path = require('path'),
	bodyParser = require('body-parser'),	
	fs = require('fs');
var uploadLimit = 838860800;
GLOBAL.approot = __dirname;
GLOBAL.IP = require(approot+'/utils/ip');
GLOBAL.config = require(approot+'/config.js');
GLOBAL.appList = config.appList;
GLOBAL.appListPort = Object.keys(appList);
var status = require(approot+'/model/status.js'),
    notify = require(approot+'/model/notify.js');	
app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.text({limit: uploadLimit}));
app.use(bodyParser.raw({limit: uploadLimit}));
app.use(bodyParser.json({limit: uploadLimit}));
app.use(bodyParser.urlencoded({extended: true, parameterLimit: uploadLimit,limit: uploadLimit}));

app.get('/screenmanager/getStatus',function(req, res){
    status.getStatusAll().then(function(data){
        res.send(data)
    },function(err){        
        res.send()
    });
})

app.post('/screenmanager/updateNotify',function(req, res){
    var reqData = req.body;
    if(reqData){
        reqData.forEach(function(item, idx){
            appList[(item.port)].notify = appList[(item.port)] ?   item.notify : appList[(item.port)].notify;
            if(reqData.length - 1 == idx){
                fs.writeFile(approot+'/config.js',"module.exports ="+JSON.stringify(config,null,4),function(err, data){
                    if(err){
                        res.send({status:0})
                    }else{
                        res.send({status:1})
                    }
                })                
            }
        })
    }
})

app.get('/screenmanager/start/:app',function(req, res){
    if(req.params.app){
        status.start(req.params.app).then(function(data){
            res.send({status:1})
        },function(err){
            res.send({status:0})
        });   
    }else{
        res.send({status:0})
    }
})

app.get('/screenmanager/stop/:app',function(req, res){
    if(req.params.app){
        status.stop(req.params.app).then(function(data){            
            res.send({status:1})
        },function(err){
            res.send({status:0})
        });   
    }else{
        res.send({status:0})
    }   
})

app.get('/screenmanager/restart/:app',function(req, res){
    if(req.params.app){
        status.restart(req.params.app).then(function(data){
            res.send({status:1})
        },function(err){
            res.send({status:0})
        });   
    }else{
        res.send({status:0})
    }   
})

var server = app.listen(config.port, function () {
    console.log("Listening on port %s...", server.address().port);
});
