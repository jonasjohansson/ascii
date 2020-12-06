var cnv, gfx, myCapture;
var style = document.createElement('style');
var ref = document.querySelector('script');
ref.parentNode.insertBefore(style, ref);

var w = window.innerWidth;
var h = window.innerHeight;
var displayWidth = 80;
var displayHeight = 80;

var tween;

if (w > h) {
    r = w / h;
    console.log(r);
    displayWidth = Math.round(80 * r);
} else {
    r = h / w;
    console.log(r);
    displayHeight = Math.round(80 * r);
}

const ascii = {
    font: null,
    fontFile: 'mono.otf',
    fontSize: 12,
    el: null,
};

const _animation = {
    timer: 0,
    duration: 6,
    delay: 0.5,
    ease: 'sine.InOut',
    min: 0,
    max: 10,
    repeat: 1,
};

const _display = {
    w: displayWidth,
    h: displayHeight,
    min: 1,
    max: 160,
    density: 1,
    invert: false,
    blendMode: 'normal',
    objectFit: 'contain',
};

const _range = {
    a: 0,
    b: 126,
    min: 32,
    max: 126,
    usePreset: true,
    chars: ' .:-=+*#%@',
};

const _posterize = {
    val: 8,
    min: 2,
    max: 20,
};

const _fade = {
    duration: 1,
    min: 0,
    max: 4,
};

const fontSize = 12;

const PARAMS = {
    displayWidth: _display.w,
    displayHeight: _display.h,
    displayInvert: _display.invert,
    displayBlendMode: _display.blendMode,
    rangeStart: _range.a,
    rangeEnd: _range.b,
    rangeUsePreset: _range.usePreset,
    rangeChars: _range.chars,
    posterize: _posterize.val,
    animationDuration: _animation.duration,
    animationDelay: _animation.delay,
    animationEase: _animation.ease,
    animationRepeat: _animation.repeat,
};

window.onload = function () {
    document.body.classList.add('show');
    ascii.el = document.getElementById('ascii');
    captureImage(document.getElementById('ascii-landing-page'));
    startUI();
    // ascii.el.addEventListener('mousedown', function () {
    //     document.body.classList.add('animate');
    // });
    // ascii.el.addEventListener('touchstart', function () {
    //     document.body.classList.add('animate');
    // });
    // ascii.el.addEventListener('mouseup', function () {
    //     document.body.classList.remove('animate');
    // });
    // ascii.el.addEventListener('touchend', function () {
    //     document.body.classList.remove('animate');
    // });
};

const captureImage = (el) => {
    domtoimage
        .toPng(el)
        .then(function (dataUrl) {
            myCapture = loadImage(dataUrl);
            setup();
        })
        .catch(function (err) {
            // console.error(err);
        });
};

function preload() {
    ascii.font = loadFont(ascii.fontFile);
}

function setup() {
    if (myCapture === undefined) return;
    for (let canvas of document.querySelectorAll('canvas')) {
        canvas.parentNode.removeChild(canvas);
    }
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
    frameRate(30);

    tween = gsap.to(_animation, {
        timer: 1,
        duration: _animation.duration,
        ease: _animation.ease,
        yoyo: true,
        repeat: _animation.repeat,
        onComplete: function () {
            document.body.classList.add('animate');
        },
    });
}

function draw() {
    background(255);
    if (myCapture === undefined) return;

    let distanceToCenter = int(dist(mouseX, mouseY, width / 2, height / 2));
    distanceToCenter = constrain(distanceToCenter, 0, width / 2);
    let distanceVal = map(distanceToCenter, 0, width / 2, 255, 0);

    var sine = sin(millis() / 1000);
    let tintVal = int(map(sine, 1, -1, 16, 255));

    // print(distanceVal, tintVal);

    gfx.tint(_animation.timer * 255, 255);
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
        title: 'ASCII Settings',
    });

    const f1 = pane.addFolder({
        title: 'Display',
    });

    const f2 = pane.addFolder({
        title: 'Character Range',
    });

    const f3 = pane.addFolder({
        title: 'Effects',
    });

    const f4 = pane.addFolder({
        title: 'Animation',
    });

    f1.addInput(PARAMS, 'displayWidth', {
        label: 'width',
        min: _display.min,
        max: _display.max,
        step: 1,
    });

    f1.addInput(PARAMS, 'displayHeight', {
        label: 'height',
        min: _display.min,
        max: _display.max,
        step: 1,
    });

    f1.addInput(PARAMS, 'displayInvert', {
        label: 'invert',
    });

    // f1.addInput(PARAMS, 'displayDensity', {
    //     label: 'density',
    //     min: 0.1,
    //     max: 2,
    // });

    f1.addInput(PARAMS, 'displayBlendMode', {
        label: 'blending mode',
        options: {
            normal: 'normal',
            colorDodge: 'color-dodge',
            hardLight: 'hard-light',
            lighten: 'lighten',
            luminosity: 'luminosity',
            screen: 'screen',
        },
    });

    // f1.addInput(PARAMS, 'displayObjectFit', {
    //     label: 'image fit',
    //     options: {
    //         contain: 'contain',
    //         cover: 'cover',
    //         fill: 'fill',
    //     },
    // });

    // f1.addInput(PARAMS, 'displayAnimate', {
    //     label: 'toggle animation',
    // });

    /* CHAR RANGE */

    // f2.addInput(PARAMS, 'rangeStart', {
    //     label: 'start',
    //     min: _range.min,
    //     max: _range.max,
    //     step: 1,
    // });

    // f2.addInput(PARAMS, 'rangeEnd', {
    //     label: 'end',
    //     min: _range.min,
    //     max: _range.max,
    //     step: 1,
    // });

    f2.addInput(PARAMS, 'rangeChars', {
        label: 'chars',
    });

    // f2.addInput(PARAMS, 'rangeUsePreset', {
    //     label: 'use preset',
    // });

    /* EFFECTS */

    f3.addInput(PARAMS, 'posterize', {
        min: _posterize.min,
        max: _posterize.max,
        step: 1,
    });

    /* ANIMATION */

    f4.addInput(PARAMS, 'animationDuration', {
        label: 'duration',
        min: _animation.min,
        max: _animation.max,
    });

    f4.addInput(PARAMS, 'animationDelay', {
        label: 'delay',
        min: _animation.min,
        max: _animation.max,
    });

    f4.addInput(PARAMS, 'animationRepeat', {
        label: 'repeat',
        min: 0,
        max: 4,
        step: 1,
    });

    f4.addInput(PARAMS, 'animationEase', {
        label: 'ease',
        options: {
            sine: 'sine',
            sineIn: 'sine.in',
            sineOut: 'sine.out',
            sineInOut: 'sine.inOut',
            expo: 'expo',
            expoIn: 'expo.in',
            expoOut: 'expo.out',
            expoInOut: 'expo.inOut',
            circ: 'circ',
            circIn: 'circ.in',
            circOut: 'circ.out',
            circInOut: 'circ.inOut',
        },
    });

    const reloadBtn = pane.addButton({
        title: 'Reload',
    });

    reloadBtn.on('click', () => {
        document.body.classList.remove('animate');
        _animation.timer = 0;
        tween.invalidate().restart();
        updateVars();
        captureImage(document.getElementById('root'));
        setup();
    });

    const updateVars = () => {
        _display.w = PARAMS.displayWidth;
        _display.h = PARAMS.displayHeight;
        _display.density = PARAMS.displayDensity;
        _display.invert = PARAMS.displayInvert;
        _range.a = PARAMS.rangeStart;
        _range.b = PARAMS.rangeEnd;
        _range.usePreset = PARAMS.rangeUsePreset;
        _range.chars = PARAMS.rangeChars;
        _posterize.val = PARAMS.posterize;
        _animation.duration = PARAMS.animationDuration;
        _animation.delay = PARAMS.animationDelay;
        _animation.ease = PARAMS.animationEase;
        _animation.repeat = PARAMS.animationRepeat;
        ascii.el.style.mixBlendMode = PARAMS.displayBlendMode;
        ascii.el.style.animationDelay = PARAMS.animationDelay + 's';
    };
}
