/*                  _____
     _____  _____  /    /____  ___
    |     \/     |/    /    /_|   |_ ___ ______  ___
    |            /    /    /\__   __|___|      \|___|
    |   \    /  /____     ___/|   | |   |   |   |   |
    |___|\__/|___|  /    /    |____\|___|___|___|___|
                   /____/     Created by: M4tini.com
*/

// polyfill
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
}
if(!window.requestAnimationFrame){
    var lastTime = 0,
    requestAnimationFrame = function(callback){
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.6 - (currTime - lastTime));
        window.setTimeout(function(){
            callback(lastTime = currTime + timeToCall);
        }, timeToCall);
    }
}

// fps
var showFps = true;
if(showFps)
{
    var frameTime = 0,
        lastLoop = new Date().getTime(),
        filterStrength = 30, // smooth frame changes
        fpsOut = document.createElement('div');
    fpsOut.style = 'position:fixed;top:5px;right:10px;';
    document.body.appendChild(fpsOut);
    setInterval(function(){
        fpsOut.innerHTML = (1000 / frameTime).toFixed(1) + ' fps';
    }, 1000);
}

// vars
var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    tempCanvas = document.createElement('canvas'),
    tempCtx = tempCanvas.getContext('2d'),
    width = 400,
    height = 240,
    ball_size = 69,
    ball_threshold = 180;

// tini preparation
document.body.appendChild(canvas);
var canvas_style = canvas.style;
canvas_style.display = 'block';
canvas_style.margin = '10% auto 0';
canvas.width  = tempCanvas.width  = width;
canvas.height = tempCanvas.height = height;

// make nice
document.title = 'Metaballs | M4tini';
var body_style = document.body.style;
body_style.margin = 0;
body_style.background = 'url(bg-body.png)';

// tini metaballs
var balls = [],
    i = 5;
do
{
    var clone = [];
    clone.x = width / 2;
    clone.y = height / 2;
    clone.vx = Math.sin(2 * Math.PI * Math.random()) * width / 444;
    clone.vy = Math.sin(2 * Math.PI * Math.random()) * height / 444;
    balls.push(clone);
}
while(--i);

function tini_loop_meta(thisLoop)
{
    // fps
    if(showFps){ var thisFrameTime = thisLoop - lastLoop; frameTime += (thisFrameTime - frameTime) / filterStrength; lastLoop = thisLoop; }

    // clean
    tempCtx.clearRect(0, 0, width, height);

    // balls
    for(var b = 0, l = balls.length; b < l; b++)
    {
        var ball = balls[b];

        ball.x += ball.vx;
        ball.y += ball.vy;

        if(ball_size > ball.x || ball.x > width  - ball_size) { ball.vx *= -1; }
        if(ball_size > ball.y || ball.y > height - ball_size) { ball.vy *= -1; }

        tempCtx.beginPath();
        var grad = tempCtx.createRadialGradient(ball.x, ball.y, 1, ball.x, ball.y, ball_size);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        tempCtx.fillStyle = grad;
        tempCtx.arc(ball.x, ball.y, ball_size, 0, Math.PI * 2);
        tempCtx.fill();
    }

    // metaballize
    var imageData = tempCtx.getImageData(0, 0, width, height),
        pix = imageData.data;

    for(var p = 0, n = pix.length; p < n; p++)
    {
        if(pix[p] < ball_threshold)
        {
            pix[p] = 0;
        }
    }
    ctx.putImageData(imageData, 0, 0);

    // logo
    ctx.drawImage(img_logo, width / 2 - 112, height / 2 - 31);

    requestAnimationFrame(tini_loop_meta);
}

var img_logo = new Image();
img_logo.src = 'bg-body-cloudless.png';
img_logo.onload = function(){
    requestAnimationFrame(tini_loop_meta);
};
