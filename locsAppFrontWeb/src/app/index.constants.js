(function() {
  'use strict';

if (window.location.host.match(/locsapp\.sylflo\.fr/))
{
	angular
	.module("LocsappServices")
	.constant("URL_API", "http://locsapp.sylflo.fr/");
}
else
{
	angular
	.module("LocsappServices")
	.constant("URL_API", "http://127.0.0.1:8000/");	
}

})();
