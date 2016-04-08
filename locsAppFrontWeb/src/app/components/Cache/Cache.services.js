/**
 * Created by sylflo on 4/8/16.
 */
(function () {

  'use strict';

  angular
    .module('LocsappServices')
    .service('CacheService', CacheService);

  /** @ngInject */
  function CacheService(CacheFactory, $log) {

    this.categories = function (APICategory) {



      var categoryCache = CacheFactory('categoryCache', {
        maxAge: 60 * 60 * 1000, // 1 hour,
        deleteOnExpire: 'aggressive'
      });

      for (var i = 0; i < APICategory.length; i++) {
        categoryCache.put('/category/' + APICategory[i]._id, {
          name: APICategory[i].name
        });


        var profile = categoryCache.get('/category/' + APICategory[i]._id);
        $log.log("in loop to fill cache = ", profile.name + " " + APICategory[i]._id);
      }


      $log.log("APICAT " + APICategory[0]._id);
    }

  }

})();
