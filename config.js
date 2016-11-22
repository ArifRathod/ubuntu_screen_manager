module.exports ={
    "port": 5555,
    "retry": 5,
    "statusChkInterval": 60000,
    "appList": {
        "3333": {
            "codePath": "/home/snow24/dev_work/Gold_User/Installer/",
            "run": "app.js",
            "screenName": "APP_3333",
            "notify": true
        },
        "5001": {
            "codePath": "/home/snow24/dev_work/Gold_User/Installer/",
            "run": "pingServer.js",
            "screenName": "APP_5001",
            "notify": true
        },
        "5552": {
            "codePath": "/home/snow24/dev_work/Gold_User/Installer/",
            "run": "appdummy.js",
            "screenName": "APP_5552",
            "notify": true
        }
    },
    "mailer": {
        "gmailhost": "smtp.gmail.com",
        "gmailemail": "abc@gmail.com",
        "password": "password_1234",
        "port": 465
    },
    "mailOptions":{
        "to":["xyz@gmail.com"],
        "subject":"ALERT : Service Failure(server:s1(<server>),Port:<port>)"    
    }
    
}