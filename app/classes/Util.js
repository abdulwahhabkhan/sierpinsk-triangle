/**
 * @file Util
 * @description general purpose class to communicate between page and worker
 */

var worker;
var stage;
var prev_conf;
var counter= 0;
/**
 * Create worker object and response handler
 * @returns {Worker}
 */
function createWorker() {
    //load worker file
    var _worker = new Worker('/dist/worker.js');
    //add message receiver call back from worker
    _worker.onmessage = function (e) {
        var m = JSON.parse(e.data);
        if(m.type === 'updateStage')
            updateStage(m.data);
    };
    _worker.onerror = function (e) {
        console.log("Work: ", e);
    }

    return _worker;
}

/**
 * update stage as per data received from worker
 * @param data {list of triangles to be displayed}
 */
function updateStage(data) {
    //add visibility to the cached triangle with position, width, height
    for (var i = 0; i < data.length; i++) {
        var child = stage.children[i];
        var row = data[i];
        child.x = row.x;
        child.y = row.y;
        child.width = row.width;
        child.height = row.height;
        child.visible = row.visible;
    }

    // Hide the rest of cached elements
    for (i; i < stage.children.length; i++) stage.children[i].visible = false;
}

/**
 * initialise worker
 * @param conf {stage: width, height, scale & position info}
 */
function init(conf) {
    stage = conf.stage;
    worker = createWorker();
}

/**
 * send message to worker
 * @param conf {stage: width, height, scale & position info}
 */
function triggerWorker(conf) {
    //if needed then only call web worker
    var isequal = _.isEqual(conf, prev_conf);
    if(isequal === false && counter < 2){
        counter ++;
        worker.postMessage(JSON.stringify({type: 'init', data: conf}));
    }

    if(counter == 2 && !isequal) {
        counter = 0;
        prev_conf = conf;
    }
}

/**
 * bundle the functions needs export
 * @type {{init: init, worker: triggerWorker}}
 */
var util = {
    init,
    worker: triggerWorker
}

export {util}