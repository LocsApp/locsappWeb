(function () {
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
		//'ngTouch',
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
		'ngWebworker',
		'angular-loading-bar',
		'angularMoment',
		'perfect_scrollbar',
		'ezfb',
		'textAngular',
		'ngFileUpload',
		'bw.paging',
    '720kb.socialshare',
    'pascalprecht.translate',
    'angular-google-analytics',
		'LocsappDirectives',
		'LocsappServices',
		'LocsappControllers']);

})();
