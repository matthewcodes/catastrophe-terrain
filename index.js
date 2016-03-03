var jimp = require("jimp");

var image = new jimp(2048, 512, function (err, image) {
    // this image is 256 x 256, every pixel is set to 0x00000000

    var terrainPoints = terrain(image.bitmap.width, image.bitmap.height, image.bitmap.height/4, 0.6)

    // for (var y = 0; y < image.bitmap.height; y++) {
    //   console.log("Y:"+y);
    //   for (var x = 0; x < image.bitmap.width; x++) {
    //     if(y > (image.bitmap.height / 2)) {
    //       image.setPixelColor(jimp.rgbaToInt(255, 255, 255, 1), x, y);
    //       console.log("set pixel colour");
    //     }
    //
    //   }
    // }

    for (var x = 0; x < image.bitmap.width; x++) {
      image.setPixelColor(jimp.rgbaToInt(255, 255, 255, 1), x, Math.round(terrainPoints[x]));

      for (var y = Math.round(terrainPoints[x]); y < image.bitmap.height; y++) {
        image.setPixelColor(jimp.rgbaToInt(255, 255, 255, 1), x, y);
      }

    }

    image.write('./terrain/test.jpeg', function (err) {
        if(err) {
          console.log("error writing file: "+err);
        } else {
          console.log("success");
        }
    });
});

function terrain(width, height, displace, roughness) {
    var points = [];
    var power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // Set the initial left point
    points[0] = height / 2 + (Math.random() * displace * 2) - displace;
    // set the initial right point
    points[power] = height / 2 + (Math.random() * displace * 2) - displace;
    displace *= roughness;

    // Increase the number of segments
    for (var i = 1; i < power; i *= 2) {
        // Iterate through each segment calculating the center point
        for (var j = (power / i) / 2; j < power; j += power / i) {
            points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
            points[j] += (Math.random() * displace * 2) - displace
        }
        // reduce our random range
        displace *= roughness;
    }
    return points;
}
