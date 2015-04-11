var app = {};

(function () {
  'use strict';

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetuserMedia;

  var Camera = app.Camera = function () {
    this.$finder = $('#finder');
  };

  Camera.prototype.initialize = function () {
    var $finder = this.$finder;

    navigator.getUserMedia({video: true}, function (stream) {
      console.log('VIDEO');
      $finder.attr('src', window.URL.createObjectURL(stream));
    }, function () {});
  };

  Camera.prototype.start = function () {
    this.$finder.show();
    this.$finder[0].play();
  };
})();

$(document).ready(function () {
  'use strict';

  var camera = new app.Camera();
  camera.initialize();

  camera.start();
});
