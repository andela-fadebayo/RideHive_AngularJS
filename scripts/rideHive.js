/*Project 6 | Andela | Fiyin Adebayo
Ride Hive Application implemented using Vehicle API
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

  $scope.fetchModels = function () {

    //success function 
    rideHiveService.getModels($scope.queryInput).success(function (data, status) {
      
      var count = data.modelsCount;

      if(count === 0) {
        $scope.statusOutput = "Searching...";
        // $scope.statusOutput = "";
        $scope.statusRoll = "./images/ajaxSpinner.gif";
      }
      else {
        $scope.statusRoll = "";
        $scope.statusOutput = "Number of " + $scope.queryInput +" models found: " + data.modelsCount;
        
        //clear models and year inputs.
        $scope.models = [];
        $scope.years = [];
        $scope.styles = [];

        //loop through data returned to retrieve models and models year
        angular.forEach(data.models, function (model, index) { 
          $scope.models.push(model);
          
          //loop again through model object to retrieve model year
          angular.forEach(model.years, function (modelYear, index) {
            
          });
        });
      } 
    });

    //error function
    rideHiveService.getModels($scope.queryInput).error(function (data, status) {
      $scope.statusOutput = "Please enter a car make!";
    });
  }; 

  
  //get car make and model year
  $scope.fetchYears = function () {

    $scope.statusOutput = "Fetching Model years...";

    rideHiveService.getYears($scope.queryInput, $scope.queryModel).success(function (data) {

      $scope.years = [];
      
      //loop theo to retrieve year
      angular.forEach(data.years, function (modelYear, index) {
        $scope.years.push(modelYear);
        $scope.statusOutput = "";
      });
    });
  }; //end of fetchYears fxn


  $scope.fetchStyles = function () {

    if ($scope.queryInput === "") {
      $scope.statusOutput = "Please enter a car make!";
    }
    else {
      rideHiveService.getStyles($scope.queryInput, $scope.queryModel, $scope.queryYear).success(function (data) {

        $scope.statusOutput = "Searching, please wait...";
        $scope.statusRoll = "./images/ajaxSpinner.gif";

      //loop yet again through years object to retried styles id
      angular.forEach(data.styles, function (style, index) {
        $scope.styles.push(style);

        $scope.carStyleId = style.id;

        rideHiveService.getPhoto($scope.carStyleId).success(function (photos) {
          
          $scope.allPhotos = [];

          angular.forEach(photos, function (photo, index) {
            
            $scope.allPhotos.push(photo);
            
          });
        });

        rideHiveService.getData($scope.carStyleId).success(function (data) {

          //Car output headings
          $scope.head1 = "Basic Information";
          $scope.head2 = "Engine Details";
          $scope.head3 = "Transmission";
          $scope.head4 = "Style";
          $scope.head5 = "Price";

          //Retrieving car info from styles data returned
          //Car basic information
          $scope.carMake = "Car Make: " + data.make.name;
          $scope.carModel = "Car Model: " + data.model.name;
          $scope.carWheels = "Number of Wheels: " + data.drivenWheels;
          $scope.carDoors = "Number of Doors: " + data.numOfDoors;
          $scope.carYear = "Year: " + data.year.year;
          $scope.carTrim = "Trim: " + data.trim;

          //Car engine details
          $scope.engineName = "Name: " + data.engine.name;
          $scope.compressionRatio ="Compression Ratio: " + data.engine.compressionRatio;
          $scope.cylinder = "Cylinder: " + data.engine.cylinder;
          $scope.engineSize = "Size: " + data.engine.size;
          $scope.engineDisplacement = "Displacement: " + data.engine.displacement;
          $scope.engineConfig = "Configuration: " + data.engine.configuration;
          $scope.engineFuel = "Fuel Type: " + data.engine.fuelType;
          $scope.horsepower = "Horsepower: " + data.engine.horsepower + "hp";
          $scope.torque = "Torque: " + data.engine.torque + "N-m";
          $scope.valves = "Valves: " + data.engine.totalValves;
          $scope.engineCode = "Engine Code: " + data.engine.manufacturerEngineCode;
          $scope.compressorType = "Compressor Type: " + data.engine.compressorType;

          //Car Transmission details
          $scope.transName = "Name: " + data.transmission.name;
          $scope.transType = "Type: " + data.transmission.transmissionType;
          $scope.transSpeed = "Speed: " + data.transmission.numberOfSpeeds;

          //Car price
          $scope.MSRP = "Manufacturer's Suggested Retail Price: $" + data.price.baseMSRP;
          $scope.Invoice = "Base Invoice: $" + data.price.baseInvoice;

          //Car Style
          $scope.styleBriefs = "Name: " + data.name;
          $scope.marketStyle = "Market Class: " + data.categories.market;
          $scope.styleClass = "EPA Class: " + data.categories.EPAClass;
          $scope.vehicleSize = "Vehicle Size: " + data.categories.vehicleSize;
          $scope.bodyType = "Body Type: " + data.categories.primaryBodyType;
          $scope.vehicleStyle = "Vehicle Style: " + data.categories.vehicleStyle;

          $scope.statusOutput = "";
          $scope.statusRoll = "";

        }); 
      }); 
    }); 
    }
  }; 

  rideHiveService.getStyles($scope.queryInput, $scope.queryModel, $scope.queryYear).error(function (data, status) {

    var count = data.modelsCount;

    if (count === 0) {
      $scope.statusOutput = "Sorry, there's no car with that name";
    }
  }); 
}]);


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

  }; 

  vehicleQuery.getYears = function (carInput, carModel) {
    var yearUrl = "https://api.edmunds.com/api/vehicle/v2/"+carInput+"/"+carModel+"?";

    return $http.get(yearUrl, {
      params: {
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  }; 


  vehicleQuery.getStyles = function (carInput, carModel, carYear) {

    var styleUrl = "https://api.edmunds.com/api/vehicle/v2/"+carInput+"/"+carModel+"/"+carYear+"?";

    return $http.get(styleUrl, {
      params: {
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  }; 

  vehicleQuery.getData = function (carStyle) {

    var dataUrl = "https://api.edmunds.com/api/vehicle/v2/styles/"+carStyle+"?";

    return $http.get(dataUrl, {
      params: {
        view: "full",
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  };

  vehicleQuery.getPhoto = function (carStyle) {

    var photoUrl = "https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId="+carStyle+"&";

    return $http.get(photoUrl, {
      params: {
        fmt: "json",
        api_key: "h8wvpc7n4jnsqxgna874tpez"
      }
    });
  }; 

  return vehicleQuery;
});