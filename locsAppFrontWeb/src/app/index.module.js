(function() {
  'use strict';

  angular
  .module("LocsappControllers", []);

  angular
  .module("LocsappServices", []);

  angular
  .module("LocsappDirectives", []);

  angular
	.module('locsapp', ['ngAnimate',
		'ngCookies',
		'ngTouch', 
		'ngSanitize', 
		'ngMessages', 
		'ngAria', 
		'ngResource', 
		'ui.router', 
		'ngMaterial', 
		'toastr', 
		'ngMdIcons', 
		'anim-in-out',
		'permission',
		'validation.match',
		'ngStorage',
		'LocsappDirectives',
		'LocsappServices',
		'LocsappControllers']);

})();
