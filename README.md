 # screenmanager
Manage Screen session through UI.
Manage your node app running in backgroung via screen.

**SETUP** 

Modify `config.js`

 - Configure `appList` as per need.
 - Create key named port on which your app running.
	 - `codePath` : "path to your code" 
	 - `run` : "which file need to run"
	 - `screenName` : "name your screen session"
	 - `notify`: "notify   (true/false) by email if app stops"
		- e.g.
	 `
	{
	    "appList": {
		        "3333": {
		            "codePath": "/home/nirav/dev_work//",
		            "run": "app.js",
		            "screenName": "APP_3333",
		            "notify": true
		        }
	    }
	}
	`
 - Configure `mailer` and `mailOptions` as per your need.
