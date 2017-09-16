/**
 * @file application main file
 * @description load and start the application
 * @module app
 */
import {Canvas} from './classes/Canvas';
import {Cache} from './classes/Cache';
import {util} from   './classes/Util';

var _  = require('lodash');
var fc = 0; //frame count
var renderer;
var stage;

/**
 * render the triangles in animation loop running 60/sec
 */
function render(){
    fc++;
    requestAnimationFrame(render);
    var currentconfig = {
        scale: {_x: stage.scale._x, _y:stage.scale._y},
        position: {_x: stage.position._x, _y:stage.position._y},
        canvasWidth: renderer.view.width,
        canvasHeight: renderer.view.height
    }
    if(fc % 15 === 0)
        util.worker(currentconfig);

    //load stage
    renderer.render(stage);
    if(fc > 60) fc=0;
}

/**
 * Load the app on window load
 */
function loadApp() {
    setTimeout(function () {
        document.getElementById("loading").style.display= 'none';
        document.getElementById("whiteboard").style.visibility= 'visible';
    }, 1500);
    initApp();
}

/**
 * initialise the app
 */
function initApp() {
    try{
        var canvas = new Canvas({id: 'whiteboard'});
        canvas.init();
        canvas.addControle();
        renderer = canvas.getRenderer();
        stage = canvas.getStage();
        var cache = new Cache({limit:500, stage: stage});
        cache.build();
        window.onresize = function () {
            var cvs = canvas.getCanvas();
            renderer.resize(cvs.w, cvs.h);
        };
        util.init({stage});
        render();

    } catch (e){
        console.error("APP: ", e);
    }
}

window.onload = loadApp();
window._ = _;
window.renderer = renderer;
window.stage = stage;