var exec = require('child_process').exec;
var q = require('q');
module.exports = function executeCMD(cmd, cb) {
	var deffered = q.defer();
	console.log("cmd : ",cmd)
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
        	console.log("error : ",error)        	
            deffered.resolve("error");
        } else {        	
            deffered.resolve(stdout);
        }
    });
	return deffered.promise;
};