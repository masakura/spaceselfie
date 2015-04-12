var app = {};

(function () {
  'use strict';

  var calculateTop = function (degree) {
    if (degree < 0) {
      degree = 180 + 180 + degree;
    }
    return (degree - 150) * 8;
  };

  $('#scope').show();

  window.addEventListener('deviceorientation', function(event) {
    var degree = app.degree = event.beta;

    var $scope = $('#scope');
    $scope.css('top', calculateTop(degree));
  }, false);

  var Satellite = app.Satellite = function () {
    this.$satellite = $('#satellite');
  };

  Satellite.prototype.start = function (success) {
    var $satellite = this.$satellite;

    $satellite.show();

    var top = 0;
    var id = setInterval(function () {
      top -= 20;
      $satellite.css('top', top);

      if ($satellite.height() + top < 0) {
        clearInterval(id);
        $satellite.hide();

        if (success) {
          success();
        }
      }
    }, 100);
  };

  Satellite.prototype.flight = function () {
    var $satellite = this.$satellite;
    var degree = 150;
    var that = this;

    $satellite.show();

    var id = setInterval(function () {
      that.degree = degree;
      that.offset = degree - app.degree;

      if (that.isChance()) {
        $('#take').addClass('btn-primary');
      } else {
        $('#take').removeClass('btn-primary');
      }

      var top = 700 - (degree - app.degree) * 12;
      that.top = top;
      console.log('chance: ' + that.isChance() + ', offset: ' + that.offset + ', degree: ' + degree + ', top: ' + top);
      $satellite.css('top', top);

      degree++;

      if (degree < 60 || degree > 300) {
        clearInterval(id);
        $satellite.hide();
      }
    }, 100);
  };

  Satellite.prototype.isChance = function () {
    var getPositon = function ($el) {
      var offset = $el.offset();
      return {
        top: offset.top,
        bottom: offset.top + $el.height()
      };
    };

    var satellite = getPositon(this.$satellite);
    var scope = getPositon($('#scope'));

    console.log('satellite: ' + satellite);
    console.log('scope: ' + scope);
    return satellite.top <= scope.bottom && satellite.bottom >= scope.top;
  };

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
    this.$map.css('zIndex', 7);
  };

  Map.prototype.hide = function () {
    this.$map.css('zIndex', 0);
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
    var $finder = $('#finder');
    var context = $picture[0].getContext('2d');
    console.log($finder[0].videoWidth);
    console.log($finder[0].videoHeight);
    $picture[0].width = $finder[0].videoWidth;
    $picture[0].height = $finder[0].videoHeight;
    context.drawImage(this.$finder[0], 0, 0);
  };

  Camera.prototype.takeMap = function () {
    this.map.show();
  };

  var App = app.App = function () {
    $('#take').hide();

    this.camera = new Camera();
    this.camera.initialize();

    this.satellite = new Satellite();

    this.camera.show();
  };

  App.prototype.take = function () {
    $('#shutter-sound')[0].play();

    $('#take').hide();
    $('#finder').hide();
//    $('#scope').hide();
//    $('#satellite').hide();
//    $('#cross').hide();

    if (this.satellite.isChance()) {
      this.camera.takeMap();
    } else {
      this.camera.takePicture();
    }
  };

  App.prototype.start = function () {
    $('#take').show();
    $('#satellite-start').hide();

    var satellite = this.satellite;

    satellite.start(function () {
      satellite.flight();
    });
  };
})();

$(document).ready(function () {
  'use strict';

  var a = new app.App();

  $('#take').on('click', function () {
    a.take();
  });

  $('#satellite-start').on('click', function () {
    a.start();
  });
});
