var q = require('q');
var executeCMD = require(approot + '/utils/executeCMD.js');

var getStatusAll = function () {
    var deffered = q.defer();
    var promiseArray = [];
    var statusData = [];
    appListPort.forEach(function (app) {
        var promiseName = executeCMD("netstat -anp 2> /dev/null | grep :" + app)
        promiseArray.push(promiseName);
    })
    Promise.all(promiseArray).then(function (data) {
        appListPort.forEach(function (app, idx) {
            var statusObj = {};
            statusObj.port = app;
            statusObj.notify = appList[app].notify;
            statusObj.screenName = appList[app].screenName;
            statusObj.status = data[idx].indexOf("error") < 0 ? "running" : "stopped";
            statusData.push(statusObj)
            if (appListPort.length - 1 == idx) {
                deffered.resolve(statusData);
            }
        })
    }, function (err) {
        deffered.reject();
    });
    return deffered.promise;
}

var getStatus = function (app) {
    var deffered = q.defer();
    if (appListPort.indexOf(app) != -1) {
        executeCMD("netstat -anp 2> /dev/null | grep :" + app).then(function (data) {
            var statusObj = {};
            statusObj.port = app;
            statusObj.status = data.indexOf("error") < 0 ? true : false;
            deffered.resolve(statusObj);            
        }, function (err) {
            deffered.reject();
        })
    } else {
        deffered.reject();
    }
    return deffered.promise;
}

var start = function (app) {
    var deffered = q.defer();
    if (appListPort.indexOf(app) != -1 && appList[app].codePath && appList[app].run && appList[app].screenName) {
        executeCMD("cd " + appList[app].codePath + " && screen -d -m -S " + appList[app].screenName + " supervisor " + appList[app].run).then(function (data) {
            if (data.indexOf("error") < 0) {
                deffered.resolve();
                setTimeout(function(){
                	getStatus(app).then(function(data){
                		if(!data.status){
                			stop(app).then(function(data){
                				console.log("App stopped ",app)
                			},function(err){
                				console.log("Error in stop ",app)
                			})
                		}
                	},function(err){
                		console.log("Error in getStatus ",app)
                	})
                },60000)
            } else {
                deffered.reject();
            }
        }, function (err) {
            deffered.reject();
        })
    } else {
        deffered.reject();
    }
    return deffered.promise;
}

var stop = function (app) {
    var deffered = q.defer();
    if (appListPort.indexOf(app) != -1 && appList[app].screenName){
	    executeCMD("screen -X -S " + appList[app].screenName + " quit").then(function (data) {
	        if (data.indexOf("error") < 0) {
	            deffered.resolve();
	        } else {
	            deffered.reject();
	        }
	    }, function (err) {
	        deffered.reject();
	    })    
    }else{
    	deffered.reject();
    }
    return deffered.promise;
}

var restart = function (app) {
    var deffered = q.defer();
    stop(app).then(function (data) {
        start(app).then(function (data) {
            deffered.resolve();
        }, function (err) {
            deffered.reject();
        });
    }, function (err) {
        start(app).then(function (data) {
            deffered.resolve();
        }, function (err) {
            deffered.reject();
        });
    });
    return deffered.promise;
}

module.exports = {
    getStatusAll: getStatusAll,
    start: start,
    stop: stop,
    restart: restart
}