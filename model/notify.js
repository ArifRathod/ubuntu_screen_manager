var q = require('q');
var fs = require('fs');
var mailer = require(approot + '/utils/mailer.js');
var status = require(approot+'/model/status.js');

try{
	var errorStatus = require(approot+'/errorStatus.json') || {};	
}catch(e){
	var errorStatus = {};
}


var updateErrorInfo = function (app, status) {
	errorStatus[app] =  (status == "stopped") ? (errorStatus[app] ? errorStatus[app]+1 : 1) : 0;	
	if(errorStatus[app] == config.retry && config.appList[app].notify){
		var mailTo = config.mailOptions.to;
		var subject = config.mailOptions.subject.replace("<server>",IP).replace("<port>",app);
		var text = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="format-detection" content="telephone=no"> <title>Service Failure Alert</title> <style type="text/css"> body { margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } table { border-spacing: 0; } table td { border-collapse: collapse; } table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { -ms-interpolation-mode: bicubic; } </style> </head> </head> <body style="background:rgba(235,235,235,0.59);margin:0;padding:0;width:100%!important"> <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="height:100%!important;margin:0;padding:10px;width:100%!important"> <tbody> <tr> <td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="background:white;max-width:600px;border: 1px solid #dcdcdc;" bgcolor="white"> <tbody> <tr> <td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom-width:0;max-width:520px;width:100%" bgcolor="#FFFFFF"> <tbody> <tr> <td style="color:#000;font-family:Open Sans,Arial;font-size:12px;font-weight:bold;line-height:100%;border-bottom: 1px solid #ebebeb;padding:10px 20px 10px;vertical-align:middle" valign="middle"><img src="http://indiantts.com/assets/images/logo.png" style="border:none;font-size:14px;font-weight:bold;min-height:27px;line-height:100%;max-width:600px!important;outline:none;text-decoration:none;text-transform:capitalize;width:150px"></td> </tr> </tbody> </table></td> </tr> <tr> <td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%"> <tbody> <tr> <td valign="top" style="background:#fff" bgcolor="#fff"><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td valign="top" style="font-size:14px; text-align:center; background:#f3f3f3; font-family: Open Sans,Arial;"><h2 style="color:red;">Service Failure Alert</h2> </td> </tr> </tbody> </table></td> </tr> </tbody> </table></td> </tr> <tr> <td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="background:#ffffff;border-bottom-width:0;max-width:520px;width:100%" bgcolor="#FFFFFF"> <tbody> <tr> <td ><img src="http://www.vibsy.com/Indiantts/nl-imgs/systemFail.png" style=" max-width: 485px; margin:0 auto; margin-top: 20px;" ></td> </tr> </tbody> </table></td> </tr> <tr> <td align="center" style="padding: 10px 20px 30px 20px; valign="top"><table border="0" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%"> <tbody> <tr> <td valign="top" style="background:#fff" bgcolor="#fff"> <table cellpadding="0" cellspacing="0" width="100%" style="color:#000;font-family:Open Sans,Arial;font-size:12px;line-height:150%;margin:10px 0px 0px;text-align:left" > <tbody> <tr> <td style="padding: 10px 20px;width: 100px;max-width: 100px;background: #f7f7f7; border: 1px solid #dadada;" valign="top">Port Number</td> <td style="padding: 10px 20px;border: 1px solid #dadada;" valign="top"> {port} </td> </tr> <tr> <td style="padding: 10px 20px;width: 100px;max-width: 100px;background: #f7f7f7; border: 1px solid #dadada;" valign="top">Services Name</td> <td style="padding: 10px 20px;border: 1px solid #dadada;" valign="top"> {screenName}</td> </tr> <tr> <td style="padding: 10px 20px;width: 100px;max-width: 100px;background: #f7f7f7; border: 1px solid #dadada;" valign="top">Server</td> <td style="padding: 10px 20px;border: 1px solid #dadada;" valign="top">{IP}</td> </tr> <tr> <td style="padding: 10px 20px;width: 100px;max-width: 100px;background: #f7f7f7; border: 1px solid #dadada;" valign="top">Code Path</td> <td style="padding: 10px 20px;border: 1px solid #dadada;" valign="top">{codePath}</td> </tr> <tr> <td style="padding: 10px 20px;width: 100px;max-width: 100px;background: #f7f7f7; border: 1px solid #dadada;" valign="top">Run</td> <td style="padding: 10px 20px;border: 1px solid #dadada;" valign="top">{run}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table></td> </tr> <tr> <td align="center" style="border-top: 1px solid #eee;" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="border-top-width:0;max-width:600px"> <tbody> <tr> <td valign="top"><table border="0" cellpadding="20" cellspacing="0" width="100%"> <tbody> <tr> <td valign="middle" style="background:#fff;color:#000" bgcolor="#fff"><div style="color:#000;font-family:Open Sans,Arial;font-size:12px;line-height:165%;margin:0px 10px;padding:0 30px;text-align:center;" align="left"> <a href="Support@indiantts.com?source=Sign&amp;medium=email" target="_blank" style="color: #62ba29; text-decoration:none;"><strong>E:</strong> Support@indiantts.com</a> <span style="font-size:12px;color:#62ba29; margin-left:10px"><strong>T:</strong> 079 40039220</span><br> <span style="font-size:10px;color:#848484;">301/2 Indiantts, Parshwa Tower, Bodakdev, S G Highway, Ahmedabad -380054</span><br> <a href="http://indiantts.com?source=Sign&amp;medium=website" style="color:#62ba29;text-decoration:none" target="_blank">www.IndianTTS.com</a> </div></td> </tr> <tr> <td valign="middle" style="background:#fff; padding:0;" bgcolor="#fff"><center> <table border="0" cellpadding="10" cellspacing="0"> <tbody> <tr> <td><a href="https://www.facebook.com/IndianTTS?source=Sign" target="_blank" style="text-decoration:none;"> <img alt="mail" src="http://www.vibsy.com/Indiantts/nl-imgs/fb.png" style="width: 16px; margin-top: 6px;"> </a></td> <td><a href="https://twitter.com/Indian_TTS?source=Sign" target="_blank" style="text-decoration:none;"> <img alt="mail" src="http://www.vibsy.com/Indiantts/nl-imgs/twitter.png" style="width: 16px; margin-top: 6px;"> </a></td> <td><a href="https://www.youtube.com/IndianTTS?source=Sign" target="_blank" style="text-decoration:none;"> <img alt="mail" src="http://www.vibsy.com/Indiantts/nl-imgs/yt.png" style="width: 16px; margin-top: 6px;"> </a></td> </tr> </tbody> </table> </center></td> </tr> </tbody> </table></td> </tr> </tbody> </table> <br></td> </tr> </tbody> </table> </body> </html>';
		text = text.replace("{port}",app)
					.replace("{screenName}",config.appList[app].screenName)
					.replace("{run}",config.appList[app].run)
					.replace("{codePath}",config.appList[app].codePath)
					.replace("{IP}",IP);
		mailer.sendNotificationMail(mailTo, subject, text).then(function(data){
			errorStatus[app] = 0;
		},function(err){
			errorStatus[app] = 0;
		})
	}else{
		if(!config.appList[app].notify){
			errorStatus[app] = 0;	
		}
		
	}
}

var writeErrorInfo = function () {
	var deffered = q.defer();
	fs.writeFile(approot+'/errorStatus.json',JSON.stringify(errorStatus, null, 4),function(err, data){
		if(err){
			console.log("err",err)
		}else{
		}
		deffered.resolve();
	})
	return deffered.promise;
}

var getErrorInfo = function () {
	var deffered = q.defer();
	status.getStatusAll().then(function(data){
        data.forEach(function(item, idx){
        		updateErrorInfo(item.port,item.status);
        	if(data.length - 1 == idx){
        		writeErrorInfo();
        	}
        })
    },function(err){        
        
    });
    return deffered.promise;  
}

setInterval(function(){
	getErrorInfo();
},config.statusChkInterval)

module.exports = {
 
}

