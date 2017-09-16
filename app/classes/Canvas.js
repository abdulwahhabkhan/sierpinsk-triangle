/**
 * @class Canvas
 * @description will create the stage on given canvas element, add zoom/pan controls
 */
var pixi = require('pixi.js');
var d3 = require('d3');


class  Canvas{
    /**
     * constructor
     * @param opt id of element to render
     */
    constructor(opt){
        this.id = opt.id;
    }

    /**
     * return canvas element
     * @returns {{e: Element, w: number, h: number}|*}
     */
    getCanvas(){
        return this.elem;
    }

    /**
     * get renderer which hold the drawing for canvas in webgl not available
     * @returns {pixi.WebGLRenderer}
     */
    getRenderer(){
        return this.renderer;
    }

    /**
     * get container, which hold the triangle container 'stage' to hold all triangles
     * @returns {pixi.Container}
     */
    getContainer(){
        return this.container;
    }

    /**
     * get stage, stage will hold the all triangles and accept interaction like zoom/pan
     * @returns {pixi.Container}
     */
    getStage(){
        return this.stage;
    }
    /**
     * initialise the canvas
     */
    init(){
        this.canvas();
        this.renderer = new pixi.WebGLRenderer(this.elem.w, this.elem.h, {view: this.elem.e, transparent: true});
        this.container  = new pixi.Container();
        this.stage = new pixi.Container();
        this.stage.interactive = true;
        this.container.addChild(this.stage);
    }
    /**
     *
     * @returns {{e: Element, w: number, h: number}|*}
     */
    canvas(){
        var elem = document.getElementById(this.id);
        var width = elem.clientWidth,
            height = elem.clientHeight;
        this.elem = { e:elem, w:width, h:height };
    }

    /**
     * add d3 zoom/pan control on cavas
     */
    addControle(){
        d3.select("#"+this.id).call(d3.zoom().scaleExtent([0.3, 10000]).on("zoom", this.zoom))
    }

    /**
     * zoom the stage using d3 event
     */
    zoom() {
        stage.position.x = d3.event.transform.x;
        stage.position.y = d3.event.transform.y;
        stage.scale.x = d3.event.transform.k;
        stage.scale.y = d3.event.transform.k;
    }

}

export {Canvas}