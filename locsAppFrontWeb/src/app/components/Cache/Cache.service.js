(function(){

	'use strict';

	angular
		.module('LocsappServices')
		.factory('CacheService', CacheService);

		/** @ngInject */
		function CacheService($resource, URL_API) {
			var service = {
				checkStaticCollectionVersion : $resource(URL_API + 'api/v1/cache/static-collections/:argument/', {argument: "@argument"})
			};

			return (service);
	}

})();