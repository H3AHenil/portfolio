(function(){
  var root = document.documentElement;
  var nav = window.navigator || {};
  var ua = nav.userAgent || "";
  var platform = (nav.userAgentData && nav.userAgentData.platform) || nav.platform || "";
  var maxTouchPoints = nav.maxTouchPoints || 0;
  var hasCoarsePointer = window.matchMedia
    ? window.matchMedia("(any-pointer: coarse)").matches
    : false;
  var isWindows = /Win/i.test(platform) || /Windows/i.test(ua);
  var isIOS = /iPad|iPhone|iPod/i.test(platform + " " + ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);

  if (isWindows) {
    root.classList.add("platform-windows");
  }

  if (hasCoarsePointer || isIOS || isAndroid) {
    root.classList.add("platform-touch");
  }
})();
