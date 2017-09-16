/**
 * @file: sierpinski
 * @description: worker file to calculate triangles grid to create sierpinski triangle
 */

import _ from 'lodash';
import {Triangle, _HFACTOR} from '../classes/Triangle';



class Sierpinski{

    /**
     * constructor
     * @param conf canvas{sale, position, height & width}
     */
    constructor(conf){
        this.init(conf);
        this.triangle = new Triangle({visible: true, width:300});
        this.triangles = this.initialChild(conf);
    }

    /**
     * setup configuration contains default values if missing from @param conf
     * @param conf canvas{sale, position, height & width}
     */
    init(conf){
        var _config = {};
        //default configuration
        var dcfg = {
            position:           {x: 0, y: 0},
            scale:              {x: 1, y: 1},
            mergeSize:  200,
            splitSize:     300,
        };
        for (let key in dcfg)
            if (dcfg.hasOwnProperty(key)) _config[key] = dcfg[key];

        for (let key in conf)
            if (conf.hasOwnProperty(key)) _config[key] = conf[key];

        this._config = _config;
    }

    /**
     * Master triangle
     * @param config
     * @returns {width, height, x, y, visible} first triangle
     */
    initialChild(config) {
        var mainTriangleBase, x, y;
        var _ML = _HFACTOR;
        if (config.canvasWidth <= config.canvasHeight) {
            mainTriangleBase = config.canvasWidth * 0.95;
            x = config.canvasWidth * 0.05;
            y = config.canvasHeight / 2 + mainTriangleBase * _ML / 2;
        } else {
            mainTriangleBase = config.canvasHeight*0.95/_ML;
            x = config.canvasWidth / 2 - mainTriangleBase / 2;
            y = config.canvasHeight * 0.98;
        }
        var _grid = this.triangle.masterTriangle(mainTriangleBase);
        _grid[0].x = x;
        _grid[0].y = y;
        return _grid;
    }

    build(){
        this.hideOutOfSight();
        this.applyMerge();
        this.applySplit();
        this.sendResponse();
    }

    /**
     * apply merge based on the min width
     */
    applyMerge(){
        var hasChildren = (tr) => {
            return _.every(tr, (tobj)=>{ return tobj.constructor !== Array});
        }
        var isMergeble = (tr) => {
            return _.every(tr, (etr) => {
                return etr.width * this._config.scale._x < this._config.mergeSize;
            });
        }
        var that = this;
        this.triangles = this.triangles.map(function findMergeable(obj) {
            if(obj.constructor === Array && hasChildren(obj)) {
                if(isMergeble(obj)) return that.triangle.mergeAction(obj);
                return obj;
            }
            if(obj.constructor === Array) return obj.map(findMergeable);
            return obj;
        });
    }

    /**
     * apply split to triangle if width more than max width
     */
    applySplit(){
        var isSplitable = (tr) => {
            return tr.width * this._config.scale._x > this._config.splitSize;
        }
        var that= this;
        this.triangles = this.triangles.map(function findSplitableTriangle(obj) {
            if(obj.constructor === Array) return obj.map(findSplitableTriangle);
            if(!obj.visible) return obj;
            if(isSplitable(obj)) {
                minsize = obj.width * 0.5;
                return that.triangle.splitAction(obj);
            }
            return obj;
        });
    }

    /**
     * hide the triangles out the canvas current width/height to improve drawing speed
     */
    hideOutOfSight(){

        /**
         * check is triangle boundaries are out of current canvas size
         * @param x triangle x
         * @param y triangle y
         * @returns {boolean}
         */
        var isOutOfCanvas = (x, y) => {
            var absX = this._config.position._x + x * this._config.scale._x;
            var absY = this._config.position._y + y * this._config.scale._y;

            if (absX < -this._config.canvasWidth      ||
                absX >  this._config.canvasWidth * 2  ||
                absY < -this._config.canvasHeight     ||
                absY >  this._config.canvasHeight * 2  ) return true;

            return false;
        };

        this.triangles = this.triangles.map(function getChildren(obj){
            if(obj.constructor === Array) return obj.map(getChildren);
            //hide those are out of canvas;
            obj.visible = !isOutOfCanvas(obj.x, obj.y);
            return obj;
        });
    }

    /**
     * get triangles needs to be displayed
     */
    getVisibleChildren(){
        return _.filter(_.flattenDeep(this.triangles), (obj)=>{ return obj.visible});
    }

    /**
     * send response back to the page with triangle grid
     */
    sendResponse(){
        //call update stage with visible triangles
        var msg = { type: 'updateStage', data: this.getVisibleChildren() };
        postMessage(JSON.stringify(msg));
    }
}

var sierpinski;
var minsize;

/**
 * start the worker
 * @param obj {canvas information}
 */
function startWorker(obj){
    if(!sierpinski)
        sierpinski = new Sierpinski(obj);
    else
        sierpinski.init(obj);

    //build the sierpinski triangle
    sierpinski.build();
}

/**
 * message receiver for worker
 * @param e
 */
onmessage =  function(e){
    var m = e.data && JSON.parse(e.data);
    if(m.type === "init")
        startWorker(m.data);
}
