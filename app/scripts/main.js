var app = {};

(function () {
  'use strict';

  var Map = app.Map = function () {
    this.$map = $('#map');

    var mapOptions = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 16,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var that = this;
    navigator.geolocation.watchPosition(function (data) {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      that.setCenter(data.coords);
    });
  };

  Map.prototype.setCenter = function (coords) {
    this.map.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
  };

  Map.prototype.setSize = function (width, height) {
    this.$map.width(width);
    this.$map.height(height);
  };

  Map.prototype.show = function () {
    this.$map.show();
  };

  Map.prototype.hide = function () {
    // 裏に回すだけ!
  };

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

      setTimeout(function () {
        $finder[0].play();
      });
    }, function () {});

    this.map = new Map();
  };

  Camera.prototype.show = function () {
    this.$finder.show();
  };

  Camera.prototype.hide = function () {
    this.$finder.hide();
  };

  Camera.prototype.takePicture = function () {
    var $picture = $('#picture');
    var context = $picture[0].getContext('2d');
    context.drawImage(this.$finder[0], 0, 0);
  };
})();

$(document).ready(function () {
  'use strict';

  var camera = new app.Camera();
  camera.initialize();

  $('#start').on('click', function () {
    camera.show();
  });

  $('#take').on('click', function () {
    camera.takePicture();
  });

  $('#map-show').on('click', function () {
    $('#map').css('zIndex', 7);
  });

  $('#map-hide').on('click', function () {
    $('#map').css('zIndex', 0);
  });
});
