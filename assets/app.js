var cnv;
var myCapture = null;
var style = document.createElement("style");
var ref = document.querySelector("script");
ref.parentNode.insertBefore(style, ref);

const ascii = {
  font: null,
  fontFile: "mono.otf",
  fontSize: 12,
  el: null,
};

const _display = {
  w: 120,
  h: 80,
  min: 1,
  max: 160,
  density: 1,
  invert: false,
  blendMode: "normal",
  objectFit: "contain",
  animate: true,
};

const _range = {
  a: 0,
  b: 126,
  min: 32,
  max: 126,
  usePreset: true,
  chars: " .:-+*=!oidutsenca ",
};

const _posterize = {
  val: 10,
  min: 2,
  max: 20,
};

const fontSize = 12;

const PARAMS = {
  displayWidth: _display.w,
  displayHeight: _display.h,
  displayDensity: _display.density,
  displayInvert: _display.invert,
  displayBlendMode: _display.blendMode,
  displayObjectFit: _display.objectFit,
  displayAnimate: _display.animate,
  rangeStart: _range.a,
  rangeEnd: _range.b,
  rangeUsePreset: _range.usePreset,
  rangeChars: _range.chars,
  posterize: _posterize.val,
};

window.onload = function () {
  ascii.el = document.getElementById("ascii");
  captureImage(document.getElementById("root"));
  startUI();
};

const captureImage = (el) => {
  domtoimage
    .toPng(el)
    .then(function (dataUrl) {
      myCapture = loadImage(dataUrl);
      setup();
    })
    .catch(function (err) {
      console.error(err);
    });
};

function preload() {
  ascii.font = loadFont(ascii.fontFile);
}

function setup() {
  if (myCapture === null) return;
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(ascii.el);
  gfx = createGraphics(_display.w, _display.h);
  gfx.pixelDensity(_display.density);
  myAsciiArt = new AsciiArt(
    this,
    ascii.font,
    ascii.fontSize,
    _range.a,
    _range.b,
    _range.usePreset,
    _range.chars,
    _display.invert
  );
  myAsciiArt.printWeightTable();
  noStroke();
  fill(0);
  frameRate(60);
}

function draw() {
  if (myCapture === null) return;

  background(255);

  let distanceToCenter = int(dist(mouseX, mouseY, width / 2, height / 2));
  distanceToCenter = constrain(distanceToCenter, 0, width / 2);
  let distanceVal = map(distanceToCenter, 0, width / 2, 255, 0);

  var sine = sin(millis() / 4000);
  let tintVal = int(map(sine, -1, 1, 64, 255));

  // print(distanceVal, tintVal);

  if (PARAMS.displayAnimate) {
    gfx.tint(tintVal, 255);
  } else {
    gfx.tint(distanceVal, 255);
  }
  gfx.image(myCapture, 0, 0, gfx.width, gfx.height);
  gfx.filter(POSTERIZE, _posterize.val);
  ascii_arr = myAsciiArt.convert(gfx);
  //image(myCapture, 0, 0, width, height);
  myAsciiArt.typeArray2d(ascii_arr, this, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function startUI() {
  const pane = new Tweakpane({
    title: "ASCII Settings",
  });

  const f1 = pane.addFolder({
    title: "Display",
  });

  const f2 = pane.addFolder({
    title: "Character Range",
  });

  const f3 = pane.addFolder({
    title: "Effects",
  });

  f1.addInput(PARAMS, "displayWidth", {
    label: "width",
    min: _display.min,
    max: _display.max,
    step: 1,
  });

  f1.addInput(PARAMS, "displayHeight", {
    label: "height",
    min: _display.min,
    max: _display.max,
    step: 1,
  });

  f1.addInput(PARAMS, "displayInvert", {
    label: "invert",
  });

  f1.addInput(PARAMS, "displayDensity", {
    label: "density",
    min: 0.1,
    max: 2,
  });

  f1.addInput(PARAMS, "displayBlendMode", {
    label: "blending mode",
    options: {
      normal: "normal",
      screen: "screen",
      colorDodge: "color-dodge",
      luminosity: "luminosity",
    },
  });

  f1.addInput(PARAMS, "displayObjectFit", {
    label: "image fit",
    options: {
      contain: "contain",
      cover: "cover",
      fill: "fill",
    },
  });

  f1.addInput(PARAMS, "displayAnimate", {
    label: "toggle animation",
  });

  /* CHAR RANGE */

  f2.addInput(PARAMS, "rangeStart", {
    label: "start",
    min: _range.min,
    max: _range.max,
    step: 1,
  });

  f2.addInput(PARAMS, "rangeEnd", {
    label: "end",
    min: _range.min,
    max: _range.max,
    step: 1,
  });

  f2.addInput(PARAMS, "rangeChars", {
    label: "preset chars",
  });
  f2.addInput(PARAMS, "rangeUsePreset", {
    label: "use preset",
  });

  /* EFFECTS */

  f3.addInput(PARAMS, "posterize", {
    min: _posterize.min,
    max: _posterize.max,
    step: 1,
  });

  const updateBtn = pane.addButton({
    title: "Update",
  });

  updateBtn.on("click", () => {
    _display.w = PARAMS.displayWidth;
    _display.h = PARAMS.displayHeight;
    _display.density = PARAMS.displayDensity;
    _display.invert = PARAMS.displayInvert;
    _range.a = PARAMS.rangeStart;
    _range.b = PARAMS.rangeEnd;
    _range.usePreset = PARAMS.rangeUsePreset;
    _range.chars = PARAMS.rangeChars;
    _posterize.val = PARAMS.posterize;
    ascii.el.style.mixBlendMode = PARAMS.displayBlendMode;
    style.innerHTML = `html img { object-fit: ${PARAMS.displayObjectFit}; }`;

    if (cnv.elt !== null) cnv.elt.parentNode.removeChild(cnv.elt);
    captureImage(document.getElementById("root"));
  });
}
