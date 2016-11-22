angular.module('myApp').controller('homeController', ['$scope', '$http', function($scope, $http) {
    $scope.notify = {};
    var serverID = document.getElementById("serverID").value;
    console.log("-----------",serverID)
    // function serverChanged (){        
    //     serverID = document.getElementById("serverID").value;
    //     console.log("-----------",serverID)
    // }
    $scope.serverID = "s1"
    $scope.serverChanged = function () {
        console.log("serverChanged",$scope.serverID)
        $scope.getStatus();
    };
    $scope.displayLoader = function (flag) {
        if (flag) {
            $(".progress-indicator").show();
        } else {
            $(".progress-indicator").hide();
        }
    };
    $scope.getStatus = function(){
        $scope.displayLoader(true);
        $http.get(window.location.origin+"/screenmanager/"+$scope.serverID+"/getStatus")
            .success(function (res) {
                $scope.displayLoader(false);
                if(res){
                    $scope.appData = res;
                }         
            })
            .error(function(err){
                alert("Error while getting data")
            });
    }
    $scope.getStatus();
    setInterval(function(){
        $scope.getStatus()   
    },60000)
    
    $scope.start = function(app){
        $http.get(window.location.origin+"/screenmanager/"+$scope.serverID+"/start/"+app.port)
            .success(function (res) {
                $scope.displayLoader(false);
                if(res){
                    res.status == 1 ? alert("started successfully") : alert("Error while starting");
                }else{
                    alert("Error while starting");    
                }
                $scope.getStatus();                        
        });
    }

    $scope.stop = function(app){
        $http.get(window.location.origin+"/screenmanager/"+$scope.serverID+"/stop/"+app.port)
            .success(function (res) {
                $scope.displayLoader(false);
                if(res){
                    res.status == 1 ? alert("stopped successfully") : alert("Error while stopping");
                }else{
                    alert("Error while stopping");    
                }
                $scope.getStatus();                        
        });  
    }

    $scope.restart = function(app){
        $http.get(window.location.origin+"/screenmanager/"+$scope.serverID+"/restart/"+app.port)
            .success(function (res) {
                $scope.displayLoader(false);
                if(res){
                    res.status == 1 ? alert("restarted successfully") : alert("Error while restarting");
                }else{
                    alert("Error while restarting");    
                }
                $scope.getStatus();                        
        });
    }

    
    $scope.updateNotify = function(appData){
        if($scope.appData){            
            $http.post(window.location.origin+"/screenmanager/"+$scope.serverID+"/updateNotify",$scope.appData)
                .success(function (res) {
                    $scope.displayLoader(false);
                    if(res){
                        res.status == 1 ? alert("Updated successfully") : alert("Error while updating");
                    }else{
                        alert("Error while updating");    
                    }
                    $scope.getStatus();
            });        
        }
    }

    
}])
	
