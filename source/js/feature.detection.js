var featureDetect = function() {
  var features = [];

  // js detect
  document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

  // svg detect
  if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
    document.documentElement.className = document.documentElement.className.replace('no-svg', 'svg');
    features.svg = 'has-svg';
  }

  // device detect
  var documentclasses = document.documentElement.className,
    thisDevice = null,
    ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  if (!ismobile) {
    // Desktop
    document.documentElement.className = documentclasses + " desktop-detected";
    thisDevice = "desktop";
    features.device = thisDevice;
  } else {
    // Mobile
    document.documentElement.className = documentclasses + " mobile-detected";
    thisDevice = "mobile";
    features.device = thisDevice;
  }

  // touch check - fails in chrome
    function isTouchDevice() {
      return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    }

  	if(isTouchDevice()){
      features.touch = 'hasTouch';
      document.documentElement.className = document.documentElement.className.replace('no-touch', 'has-touch');
  	} else {
      features.touch = 'noTouch';
  	}

  return features;
}();
