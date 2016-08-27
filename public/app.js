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
        "all": './data/all-companies.json',

        "bucks": './data/pa-bucks.json',
        "chester": './data/pa-chester.json',
        "delaware": './data/pa-delaware.json',
        "montco": './data/pa-montgomery.json',
        "philly": './data/pa-philadelphia.json',

        "burlington": './data/nj-burlington.json',
        "camden": './data/nj-camden.json',
        "mercer": './data/nj-mercer.json',

        "new-castle": './data/de-new-castle.json',
      };

      if (fileNames[countyName]) {
        var url = './' + fileNames[countyName];
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
