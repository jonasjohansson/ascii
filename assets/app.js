var cnv, gfx, capture, tween;

const ascii = {
    font: null,
    fontFile: 'mono.otf',
    fontSize: 12,
    el: null,
    sourceEl: null,
    sourceId: 'ascii-landing-page',
};

const _animation = {
    timer: 0,
    duration: 4,
    transitionDuration: 0.5,
    delay: 1,
    ease: 'sine.InOut',
    min: 0,
    max: 10,
    repeat: 0,
};

const _display = {
    w: 60,
    h: 60,
    min: 1,
    max: 80,
    density: 2,
    invert: false,
    blendMode: 'normal',
    objectFit: 'contain',
    showSource: false,
};

var w = window.innerWidth;
var h = window.innerHeight;

if (w > h) {
    aspectRatio = w / h;
    _display.w = Math.round(_display.w * aspectRatio);
} else {
    aspectRatio = h / w;
    _display.h = Math.round(_display.h * aspectRatio);
}

if (isMobileDevice()) {
    var pixelRatio = window.devicePixelRatio || 1;
    _display.w /= pixelRatio;
    _display.h /= pixelRatio;
}

const _range = {
    a: 0,
    b: 126,
    min: 32,
    max: 126,
    usePreset: true,
    chars: ' .:+ACNESTUDIOS#@=*%.         ',
};

const _posterize = {
    val: 8,
    min: 2,
    max: 20,
};

const fontSize = 12;

const PARAMS = {
    displayWidth: _display.w,
    displayHeight: _display.h,
    displayInvert: _display.invert,
    displayBlendMode: _display.blendMode,
    displayShowSource: _display.showSource,
    rangeStart: _range.a,
    rangeEnd: _range.b,
    rangeUsePreset: _range.usePreset,
    rangeChars: _range.chars,
    posterize: _posterize.val,
    animationDuration: _animation.duration,
    animationTransitionDuration: _animation.transitionDuration,
    animationDelay: _animation.delay,
    animationEase: _animation.ease,
    animationRepeat: _animation.repeat,
};

function preload() {
    ascii.font = loadFont(ascii.fontFile);
}

function setup() {
    if (capture === undefined) return;
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

    // myAsciiArt.printWeightTable();
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
    if (capture === undefined) return;
    background(255);
    gfx.tint(_animation.timer * 255, 255);
    gfx.image(capture, 0, 0, gfx.width, gfx.height);
    gfx.filter(POSTERIZE, _posterize.val);
    ascii_arr = myAsciiArt.convert(gfx);
    if (_display.showSource) image(gfx, 0, 0, width, height);
    myAsciiArt.typeArray2d(ascii_arr, this, 0, 0);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

window.onload = function () {
    document.body.classList.add('show');
    ascii.el = document.getElementById('ascii');
    ascii.sourceEl = document.getElementById(ascii.sourceId);
    setTimeout(function(){
        captureImage(ascii.sourceEl);
    },100);
};

function captureImage(el) {
    // htmlToImage.toJpeg(el, { quality: 0.7 }).then(function (dataUrl) {
    //     loadImage(dataUrl, (img) => {
    //         capture = img;
    //         updateVars();
    //         setup();
    //         startUI();
    //     });
    // });

    domtoimage.toJpeg(el).then(function (dataUrl) {
        domtoimage.toJpeg(el).then(function (dataUrl) {
            loadImage(dataUrl, (img) => {
                capture = img;
                updateVars();
                setup();
                startUI();
                // var link = document.createElement('a');
                // link.download = 'my-image-name.jpeg';
                // link.href = dataUrl;
                // link.click();
            });
        });
    });
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

    f1.addInput(PARAMS, 'displayShowSource', {
        label: 'show source',
        showSource: false,
    });

    /* CHAR RANGE */

    f2.addInput(PARAMS, 'rangeChars', {
        label: 'chars',
    });

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
        step: 0.2,
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

    // f4.addInput(PARAMS, 'animationEase', {
    //     label: 'ease',
    //     options: {
    //         sine: 'sine',
    //         sineIn: 'sine.in',
    //         sineOut: 'sine.out',
    //         sineInOut: 'sine.inOut',
    //         expo: 'expo',
    //         expoIn: 'expo.in',
    //         expoOut: 'expo.out',
    //         expoInOut: 'expo.inOut',
    //         circ: 'circ',
    //         circIn: 'circ.in',
    //         circOut: 'circ.out',
    //         circInOut: 'circ.inOut',
    //     },
    // });

    f4.addInput(PARAMS, 'animationTransitionDuration', {
        label: 'transition',
        min: 0,
        max: 2,
    });

    const reloadBtn = pane.addButton({
        title: 'Reload',
    });

    reloadBtn.on('click', () => {
        document.body.classList.remove('animate');
        _animation.timer = 0;
        tween.invalidate().restart();
        updateVars();
        captureImage(ascii.sourceEl);
        setup();
    });
}

const updateVars = () => {
    _display.w = PARAMS.displayWidth;
    _display.h = PARAMS.displayHeight;
    _display.density = PARAMS.displayDensity;
    _display.invert = PARAMS.displayInvert;
    _display.showSource = PARAMS.displayShowSource;
    _range.a = PARAMS.rangeStart;
    _range.b = PARAMS.rangeEnd;
    _range.usePreset = PARAMS.rangeUsePreset;
    _range.chars = PARAMS.rangeChars;
    _posterize.val = PARAMS.posterize;
    _animation.duration = PARAMS.animationDuration;
    _animation.transitionDuration = PARAMS.animationTransitionDuration;
    _animation.delay = PARAMS.animationDelay;
    _animation.ease = PARAMS.animationEase;
    _animation.repeat = PARAMS.animationRepeat;
    ascii.el.style.mixBlendMode = PARAMS.displayBlendMode;
    ascii.el.style.animationDelay = PARAMS.animationDelay + 's';
    ascii.el.style.animationDuration = _animation.transitionDuration + 's';
};

function isMobileDevice() {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    );
}
