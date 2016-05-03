(function() {
  'use strict';

  angular.module('jobapp', ['ngRoute']);


  angular
    .module('jobapp')
    .config(countyRoutes);
  countyRoutes.$inject = ['$routeProvider'];

  function countyRoutes($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'rootController',
        controllerAs: 'vm',
        templateUrl: './templates/counties.html'
      })
      .when('/county/:countyname', {
        controller: 'rootController',
        controllerAs: 'vm',
        templateUrl: './templates/counties.html'
      })
      .otherwise({
        redirectTo: '/'
      })
  }


  angular
    .module('jobapp')
    .service('Opportunity', opportunity);
  opportunity.$inject = ['$http'];

  function opportunity($http) {
    return {
      getCounty: getCounty
    };

    function getCounty(countyName) {
      var fileNames = {
        "all": 'all-companies.json',

        "bucks": 'pa-bucks.json',
        "chester": 'pa-chester.json',
        "delaware": 'pa-delaware.json',
        "montco": 'pa-montgomery.json',
        "philly": 'pa-philadelphia.json',

        "burlington": 'nj-burlington.json',
        "camden": 'nj-camden.json',
        "mercer": 'nj-mercer.json',

        "new-castle": 'de-new-castle.json',
      };

      if (fileNames[countyName]) {
        var url = 'https://raw.githubusercontent.com/mcelaney/opportunities/master/' + fileNames[countyName];
        return $http.get(url)
          .then(getCountyComplete)
          .catch(getCountyFailed);
      } else {
        return [];
      }

      function getCountyComplete(response) {
        return response.data;
      }

      function getCountyFailed(error) {
        console.error('XHR Failed for getCounty.' + error.data);
      }
    }
  }


  angular
    .module('jobapp')
    .controller("rootController", rootController);
  rootController.$inject = ['$routeParams', 'Opportunity'];

  function rootController($routeParams, Opportunity) {
    var vm = this;
    vm.data = null;

    vm.countyName = $routeParams.countyname ? $routeParams.countyname : "all";

    getCounty();

    function getCounty() {
      return Opportunity.getCounty(vm.countyName)
        .then(function(data) {
          vm.data = data;
          return vm.data;
        });
    }
  }

})();
