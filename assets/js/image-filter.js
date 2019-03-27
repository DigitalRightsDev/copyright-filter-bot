window.onload = (function(meme, memeUpload){
  // Get image and text description elements
  var image = document.getElementById(meme);
  var textsParent = document.getElementById(memeUpload);
  // Fade in text
  finTexts(textsParent, "upload", 0);
  var typicon = document.getElementsByClassName('typcn-arrow-up-thick')[0]
  blink(typicon);
  // Fade in image
  return fin(image, 0).then(function(el){
    // Create canvas from image and map canvas image pixels
    return createCanvas(el, 2000);
  }).then(function(canvas_colorSet){
    // finTexts(textsParent, "outliers", 0);
    canvas_colorSet.filter = removeOutliers;
    return computeDestinations(canvas_colorSet, 2000);
  }).then(function(computeDestinationsInfo){
    // Gausian decomposition
    finTexts(textsParent, "gaussian", 0);
    return decomposeOrCompose(computeDestinationsInfo, "decompose", 2000, 3)
  }).then(function(){
    finTexts(textsParent, "database", 0);
    var canvas = document.getElementById(meme + '_canvas');
    blink(canvas);
    var unimage = document.getElementById('un' + meme);
    return createCanvas(unimage, 0);
  }).then(function(uncanvas_colorSet){
    return computeDestinations(uncanvas_colorSet, 0);
  }).then(function(computeDestinationsInfo){
    // Gausian decomposition
    return decomposeOrCompose(computeDestinationsInfo, "decompose", 2000, 1);
  }).then(function(computeDestinationsInfo){
    var newCanvas = document.getElementById('un' + meme + '_canvas');
    document.getElementById(meme + '_canvas').remove();
    document.getElementById(meme + '_div').appendChild(newCanvas);
    document.getElementById('un' + meme + '_div').remove();
    // Gausian decomposition
    finTexts(textsParent, "coincidence", 0);
    typicon.classList.remove('typcn-arrow-up-thick');
    typicon.classList.add('typcn-times');
    return decomposeOrCompose(computeDestinationsInfo, "compose", 2000, 20);
  }).then(function(){
    // Upload cancelled
    finTexts(textsParent, "cancelled", 0);
    return returnIniMeme(meme, 1000);
  }).then(function(){
    // Second meme function!

    (function(meme, memeUpload){
      // Get image and text description elements
      var image = document.getElementById(meme);
      var textsParent = document.getElementById(memeUpload);
      // Fade in text
      finTexts(textsParent, "upload", 0);
      var typicon = document.getElementsByClassName('typcn-arrow-up-thick')[0]
      blink(typicon);
      // Fade in image
      return fin(image, 0).then(function(el){
        // Create canvas from image and map canvas image pixels
        return createCanvas(el, 500);
      }).then(function(canvas_colorSet){
        // finTexts(textsParent, "outliers", 0);
        canvas_colorSet.filter = removeOutliers;
        return computeDestinations(canvas_colorSet, 2000);
      }).then(function(computeDestinationsInfo){
        // Gausian decomposition
        finTexts(textsParent, "gaussian", 0);
        return decomposeOrCompose(computeDestinationsInfo, "decompose", 2000, 3)
      }).then(function(){
        finTexts(textsParent, "database", 0);
        var canvas = document.getElementById(meme + '_canvas');
        blink(canvas);
        var unimage = document.getElementById('un' + meme);
        return createCanvas(unimage, 0);
      }).then(function(uncanvas_colorSet){
        return computeDestinations(uncanvas_colorSet, 0);
      }).then(function(computeDestinationsInfo){
        // Gausian decomposition
        return decomposeOrCompose(computeDestinationsInfo, "decompose", 2000, 1);
      }).then(function(computeDestinationsInfo){
        var newCanvas = document.getElementById('un' + meme + '_canvas');
        document.getElementById(meme + '_canvas').remove();
        document.getElementById(meme + '_div').appendChild(newCanvas);
        document.getElementById('un' + meme + '_div').remove();
        // Gausian decomposition
        finTexts(textsParent, "coincidence", 0);
        typicon.classList.remove('typcn-arrow-up-thick');
        typicon.classList.add('typcn-times');
        return decomposeOrCompose(computeDestinationsInfo, "compose", 2000, 20);
      }).then(function(){
        // Upload cancelled
        finTexts(textsParent, "cancelled", 0);
        return returnIniMeme(meme, 1000);
      });
    })("meme2", "meme-upload2");

    // Second meme function!
  });
})("meme1", "meme-upload1");

// Return the inicial meme
function returnIniMeme(meme, timeout) {
  return new Promise(function(res, rej){
    setTimeout(function(){
      var memeImg = document.getElementById(meme);
      document.getElementById('un' + meme + '_canvas').style.display = "none";
      memeImg.style.display = 'block';
      memeImg.style.opacity = 1;
      document.getElementById(meme + '_div').style.opacity = "0.4";
      res();
    }, timeout);
  });
}

// Fade in element
function fin(el, i) {
  return new Promise(function(res, rej){
    iteration(el, i);
    function iteration(el, i) {
      if(i > 1) {
        res(el);
        return;
      }else{
        i += 0.01;
        setTimeout(function(){el.style.opacity = i; iteration(el, i)}, 10);
      }
    };
  });
}

// Fade in element
function blink(el) {
  iterate(el, 1, 1);
  function iterate(el, i, sign){
    if(i >= 1 || i <= 0) {
      sign = (-1)*sign;
    }
    i += sign*0.01;
    setTimeout(function(){el.style.opacity = i; iterate(el, i, sign)}, 10);
  }
}

function finTexts(textsParent, textClass, i){
  var texts = textsParent.getElementsByTagName('span');
  for (let j = 0; j < texts.length; j++){
    texts[j].style.display = 'none';
    texts[j].style.opacity = '0';
  }
  text = textsParent.getElementsByClassName(textClass)[0];
  text.style.display = 'inline';
  fin(text, i);
}

function createCanvas(img, timeout){
  var canvas = document.createElement('canvas');
  canvas.id = img.id + '_canvas';
  var colorSet = new Map(); // maps color value to pixel info
  // I use state to determine whether it should expand or collapse
  var currentStage = 1;
  // Width and height of the working image
  canvas.width = img.width;
  canvas.height = img.height;
  // Start decomposing
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var parent = img.parentNode
  img.style.display = "none";
  parent.appendChild(canvas);

  return new Promise(function(res, rej){
    setTimeout(function() {
      res({canvas, colorSet});
    }, timeout);
  });
}

function removeOutliers(r,g,b){
  if(r + g + b < 6*3 || r + g + b > 249*3){
    return true;
  } else {
    return false;
  }
}

//Collected pixels
function computeDestinations(canvas_colorSet_filter, timeout) {
  var canvas = canvas_colorSet_filter.canvas;
  var colorSet = canvas_colorSet_filter.colorSet;
  var filter = canvas_colorSet_filter.filter;
  var width = canvas.width;
  var height = canvas.height;
  var ctx = canvas.getContext('2d');
  var imgData = ctx.getImageData(0, 0, width, height);
  var pixels = imgData.data;

  // This is to properly scale the height of the chart
  var maxColorsInBin = 0;

  // We are going to collect pixel values first
  for (var x = 0; x < width; ++x) {
    for (var y = 0; y < height; ++y) {
      var i = (x + y * width) * 4;
      var r = pixels[i + 0];
      var g = pixels[i + 1];
      var b = pixels[i + 2];
      var a = pixels[i + 3];
      var color = chroma(r, g, b);
      if(filter && filter(r, g, b)){
        continue;
      } else {
      }
      var colorKey = color.get('hsl.l')

      var pixelInfo = colorSet.get(colorKey);
      if (!pixelInfo) {
        pixelInfo = {
          points: [],
        };
        colorSet.set(colorKey, pixelInfo);
      }
      pixelInfo.points.push({
        // original position of a pixel
        x: x,
        y: y,
        // Randomly assign animation lifespan
        timeSpan: 60,
        // current frame number, used for interpolation
        frame: 0,
        // Where this pixel should go? Will be computed by computeDestinations()
        destX: 0,
        destY: 0,
        // Current color
        color: color
      });
      // We need to know the highest point of a chart, to properly scale it inside
      // available canvas
      if (pixelInfo.points.length > maxColorsInBin) maxColorsInBin = pixelInfo.points.length;
    }
  }
  // This function computes where the pixel should go, based on its value
  var binCount = 256;
  var binWidth = (width/binCount);
  colorSet.forEach((pixelInfo, colorKey) => {
    var pointBin = colorKey * binCount;
    var xOffset = pointBin * binWidth;
    var yOffset = 1/maxColorsInBin;
    pixelInfo.points.forEach((point, idx) => {
      point.destX = xOffset;
      // I add small coefficients to make a padding.
      point.destY = height * 0.85 - 0.80 * height * idx /maxColorsInBin;
    })
  });
  return new Promise(function(res, rej){
    setTimeout(function() {
      res({canvas, colorSet});
    }, timeout);
  });
}


function interpolate(t) {
  // This is easeInOutQuad function. See more here https://gist.github.com/gre/1650294
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function lerp(a, b, t) {
  // simple linear interpolation.
  return b * t + a * (1 - t);
}

// Decompose or compose
function decomposeOrCompose(computeDestinationsInfo, decOrComp, timeout, speed) {
  return new Promise(function(res, rej){
    iteration(computeDestinationsInfo, speed);
    function iteration(computeDestinationsInfo) {
      requestAnimationFrame(function(){
        var done = move(computeDestinationsInfo, decOrComp);
        if (done){
          setTimeout(function(){
            res(computeDestinationsInfo);
          },timeout);
        }else{
          speed++;
          setTimeout(function(){
            iteration(computeDestinationsInfo);
          },speed);
        }
      });
    };
  });
}

// Main animation composition/decomposition
function move(computeDestinationsInfo, currentStage) {
  var canvas = computeDestinationsInfo.canvas;
  var colorSet = computeDestinationsInfo.colorSet;
  var width = canvas.width;
  var height = canvas.height;
  var ctx = canvas.getContext('2d');

  // When all pixels cannot be moved anymore, we switch the mode.
  var hasMore = false;
  // Need to pick neutral background color to not blend with original colors
  ctx.fillStyle = window.getComputedStyle(document.getElementsByClassName('me')[0]).backgroundColor;
  ctx.fillRect(0, 0, width, height);

  var imgData = ctx.getImageData(0, 0, width, height);
  var pixels = imgData.data;
  // Okay, let's move the pixels
  colorSet.forEach((pixelInfo, colorKey) => {
    pixelInfo.points.forEach((point) => {
      // given current frame, use easing to figure out offset of a pixel
      var t = interpolate(point.frame/point.timeSpan);
      if (currentStage === "decompose" && point.frame < point.timeSpan) {
        point.frame += 1;
        // if at least one point was moved - keep trying on the next frame
        hasMore = true;
      }  else if (currentStage === "compose" & point.frame > 0) {
        point.frame -= 1;
        hasMore = true;
        // I want to restore portrait faster than collapsing it:
        if (point.frame > 0) point.frame -= 1;
      }
      var x = Math.round(lerp(point.x, point.destX, t));
      var y = Math.round(lerp(point.y, point.destY, t));
      // Color has four components, thus multplying by 4
      var pixelIndex = (x + y * width) * 4;
      var color = point.color.rgba();
      pixels[pixelIndex + 0] = color[0];
      pixels[pixelIndex + 1] = color[1];
      pixels[pixelIndex + 2] = color[2];
      pixels[pixelIndex + 3] = color[3] * 255;
    });
  });
  // All pixels updated on this frame, lets draw them
  ctx.putImageData(imgData, 0, 0);

  if (!hasMore) {
    return "DONE";
  } else {
    return false;
  }
}
