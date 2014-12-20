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

  $scope.models = [];

  $scope.years = [];

  $scope.fetchModels = function () {

    //success function 
    rideHiveService.getModels($scope.queryInput).success(function (data, status) {
      // console.log("Yay! its here: " + data);
      
      var count = data.modelsCount;
      // console.log("models count: " + count);

      if(count === 0) {
        // $scope.statusOutput = "Car make with name '" + $scope.queryInput + "' is not found!";
        $scope.statusOutput = "Searching...";
      }
      else {
        $scope.statusOutput = "Number of " + $scope.queryInput +" models found: " + data.modelsCount;
        
        //clear models and year inputs.
        $scope.models = [];
        $scope.years = [];
        $scope.styles = [];

        //loop through data returned to retrieve models and models year
        angular.forEach(data.models, function (model, index) { 
          $scope.models.push(model);
          // console.log("Honda models: " + model.name);
          
          //loop again through model object to retrieve model year
          angular.forEach(model.years, function (modelYear, index) {
            // $scope.years.push(modelYear);
            // console.log("Honda years " + modelYear.year);

            
          }); //end of year forEach
        }); //end of model forEach
      } //end of else
    });
  }; //end of fetchModels fxn

  
  //get car make and model year
  $scope.fetchYears = function () {

    $scope.statusOutput = "Please wait...";

    rideHiveService.getYears($scope.queryInput, $scope.queryModel).success(function (data) {
      console.log("here are your years: " + data.id);

      $scope.years2 = [];
      
      //loop theo to retrieve year
      angular.forEach(data.years, function (modelYear, index) {
        $scope.years2.push(modelYear);
        $scope.statusOutput = "";
      });
    });
  }; //end of fetchYears fxn


  $scope.fetchStyles = function () {
    // console.log("info: " + $scope.queryInput + $scope.queryModel + $scope.queryYear);
    rideHiveService.getStyles($scope.queryInput, $scope.queryModel, $scope.queryYear).success(function (data) {
      console.log("Here's your styles data: " + data);

      //loop yet again through years object to retried styles id
      angular.forEach(data.styles, function (style, index) {
        $scope.styles.push(style);

        $scope.carStyleId = style.id;

        console.log("car retrievd id " + style.id);

        rideHiveService.getData($scope.carStyleId).success(function (data) {
          console.log("YOY! it worked " + data.engine.fuelType);

          //Car output headings
          $scope.head1 = "Basic Information";
          $scope.head10 = "Car Make:";
          $scope.head2 = "Engine Details";

          //Retrieving car info from styles data returned
          //Car basic information
          $scope.carMake = data.make.name;
          $scope.carModel = data.model.name;
          $scope.carWheels = data.drivenWheels;
          $scope.carDoors = data.numOfDoors;
          $scope.carYear = "Year: " + data.year.year;
          $scope.carState = data.states;
          $scope.carTrim = data.trim;

          //Car engine details
          $scope.engineName = data.engine.name;
          $scope.compressionRatio ="Compression Ratio: " + data.engine.compressionRatio;
          $scope.cylinder = data.engine.cylinder;
          $scope.engineSize = data.engine.size;
          $scope.engineDisplacement = data.engine.displacement;
          $scope.engineConfig = data.engine.configuration;
          $scope.engineFuel = data.engine.fuelType;
          $scope.horsepower = data.engine.horsepower;
          $scope.torque = data.engine.torque;
          $scope.valves = data.engine.totalValves;
          $scope.engineCode = data.engine.manufacturerEngineCode;
          $scope.compressorType = data.engine.compressorType;

          //Car Transmission details
          $scope.transName = data.transmission.name;
          $scope.transType = data.transmission.transmissionType;
          $scope.transSpeed = data.transmission.numberOfSpeeds;

          //Car price
          $scope.MSRP = data.price.baseMSRP;
          $scope.Invoice = data.price.baseInvoice;

          //Car Style
          $scope.styleBriefs = data.name;
          $scope.marketStyle = data.categories.market;
          $scope.styleClass = data.categories.EPAClass;
          $scope.vehicleSize = data.categories.vehicleSize;
          $scope.bodyType = data.categories.primaryBodyType;
          $scope.vehicleStyle = data.categories.vehicleStyle;






        }); //end of data service
      }); //end of styles forEach
    }); //end of styles service
  }; //end of fetchStyles fxn


}]);


/* ----------------- CREATING SERVICES USING FACTORY ----------- */

//Create a service using .factory to query vehicle API and grab required data
rideHiveApp.factory('rideHiveService', function ($http) {

  var vehicleQuery = {};

  //This query gets user input and returns data of models and years
  vehicleQuery.getModels = function (carInput) {
  
  var rawUrl = "https://api.edmunds.com/api/vehicle/v2/"+carInput+"/models?";

  return $http.get(rawUrl, {
    params: {
      fmt: "json",
      api_key: "h8wvpc7n4jnsqxgna874tpez"
    }
  });

  }; //end of vehicleQuery

  vehicleQuery.getYears = function (carInput, carModel) {
    var yearUrl = "https://api.edmunds.com/api/vehicle/v2/"+carInput+"/"+carModel+"?";

    return $http.get(yearUrl, {
      params: {
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  }; //end of yearQuery


  vehicleQuery.getStyles = function (carInput, carModel, carYear) {

    var styleUrl = "https://api.edmunds.com/api/vehicle/v2/"+carInput+"/"+carModel+"/"+carYear+"?";

    return $http.get(styleUrl, {
      params: {
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  }; //end of styleQuery

  vehicleQuery.getData = function (carStyle) {

    var dataUrl = "https://api.edmunds.com/api/vehicle/v2/styles/"+carStyle+"?";

    return $http.get(dataUrl, {
      params: {
        view: "full",
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  }; //end of dataQuery


  return vehicleQuery;
});








/*rideHiveApp.factory('yearService', function ($http) {

  var yearQuery = {};

  //Get year based on car make and model selections
  yearQuery
  return yearQuery;

});

rideHiveApp.factory('stylesService', function ($http) {

  var styleQuery = {};

  //This query takes user car make input, model and year selections and get styles id for a particular model and year
  styleQuery

  return styleQuery;
});


rideHiveApp.factory('carDataService', function ($http) {

  var dataQuery = {};

  //This query takes style id of a particular car make, model and year returned and get all data for that car
  dataQuery

  return dataQuery;
});*/