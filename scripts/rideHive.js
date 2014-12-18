/*Project 6 | Andela | Fiyin Adebayo
rideHive Application implemented using Vehicle API
17th December, 2014.

Implementing using AngularJS and services.

This app displays car make models details based on some search criterias

1. User types in car make
     use it to query and get models;
     if modelsCount = 0, display error "make not found";
2. Append car model to a drop down list to choose from.
3. Append year to a drop down list to choose from.
4. Make query search based on these criterias.
5. Make another search based on styleId gotten from (4) above to get more info about the specific model.
6. Display the results gotten on a page.
7. Generate a link to photos and append styles id.
8. Query for photos when a user clicks the link.
9. Display photos for a specific model on a new tab/window.
*/

var rideHiveApp = angular.module('rideHiveApp', []);

rideHiveApp.controller('rhController', ['$scope', 'rideHiveService', function ($scope, rideHiveService) {

  $scope.names = "ceemion";
  // $scope.statusOutput = "Ride on hives...";

  $scope.fetchModels = function () {

    //success function 
    rideHiveService.getModels($scope.queryInput).success(function (data, status) {
      console.log("Yay! its here: " + data);
      
      var count = data.modelsCount;
      console.log("models count: " + count);

      if(count === 0) {
        $scope.statusOutput = "Car make with name '" + $scope.queryInput + "' is not found!";
      }
      else {
        $scope.statusOutput = "number of car models found: " + data.modelsCount;
        $scope.carModels = data.models.name;
        console.log("Honda models: " + $scope.carModels);
      }
    });
  }; //end of fetchModels fxn

}]);


//Create a service using .factory to query vehicle API and grab required data

rideHiveApp.factory('rideHiveService', function ($http) {

  //first api call: get car nice name

  var vehicleQuery = {};

  vehicleQuery.getModels = function (carInput) {
  
  var rawUrl = "https://api.edmunds.com/api/vehicle/v2/"+carInput+"/models?";

  return $http.get(rawUrl, {
    params: {
      fmt: "json",
      api_key: "h8wvpc7n4jnsqxgna874tpez"
    }
  });

  };

  return vehicleQuery;
});