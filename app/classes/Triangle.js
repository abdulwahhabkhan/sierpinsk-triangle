/**
 * @class Triangle
 * @description this class contains all the functions required to draw, manipulate, position triangle
 * this is used by cache and worker classes
 */

import _ from 'lodash';

var _HFACTOR = 1;

/**
 * Build the triangle and it into 3^depth which will be used as basic building block
 */

class Triangle {

    /**
     *
     * @param opt
     * @param opt.width main master triangle width
     * @param opt.visible default visibility value
     * @param opt.position default position
     * @param opt.scale default scale
     * @param opt.depth number of nested triangles default value 3 mean one grid = 3^3 triangles
     */
    constructor(opt){
        this.width = opt.width;
        this.visible = opt.visible|| true;
        this.position = opt.position || {x:0, y:0};
        this.scale = opt.scale || {x: 1, y: 1};
        this.depth = opt.depth || 3;
    }

    /**
     * start with one master and split them 3^depth
     * this is the minimum unit of triangles to be displayed
     * @returns {pixi.graphics: element filled with triangles}
     */
    buildTriangleGrid(){
        this.main = this.masterTriangle(this.width)

        for(let i=0; i<this.depth; i++)
           this.main= this.faractalAction(this.main);

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF); // White
        this.drawTriangle(graphics);
        graphics.endFill();

        graphics.position = this.position;
        graphics.scale = this.scale;
        if (this.visible !== undefined) graphics.visible = this.visible;
        return graphics;
    }

    /**
     * master triangle for grid of triangles
     * @param w width
     * @returns {triangle object}
     */
    masterTriangle(w){
        this.width = w;
        this.height = this.width*_HFACTOR;
        return [{
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            visible: true
        }];
    }

    /**
     * traverse all triangle and apply split
     * @param trs
     * @returns {Array}
     */
    faractalAction(trs){
        var that = this;
        return this.main.map(function fractalIteration(obj) {
            if(obj.constructor === Array) //if is array traverse the array
                return obj.map(fractalIteration);
            //if not array do child split
            return that.splitAction(obj);
        })
    }

    /**
     * split the triangle into 3 triangles
     * @param child
     * @returns {[child,child,child]}
     */
    splitAction(child){
        child.width *= 0.5;
        child.height *= 0.5;

        var child2 = {
            x: child.x + child.width,
            y: child.y,
            width: child.width,
            height: child.height,
            visible: true
        };

        var child3 = {
            x: child.x + child.width/2,
            y: child.y - child.width*_HFACTOR,
            width: child.width,
            height: child.height,
            visible: true
        }

        return [child, child2, child3];
    }

    /**
     * during zoom out merge the children into one
     * @param obj triangle array 3 triangles of equal size
     * @returns triangle equal to merge of all 3
     */
    mergeAction(obj){
        obj[0].width *= 2;
        obj[0].height *= 2;
        return obj[0];
    }

    /**
     * create triangle lines
     * @param graphics
     */
    drawTriangle(graphics){
        _.each(_.flattenDeep(this.main), (tr) => {
            graphics.moveTo(tr.x, tr.y);
            graphics.lineTo(tr.x + tr.width, tr.y);
            graphics.lineTo(tr.x + tr.width / 2, tr.y - tr.height);
            graphics.lineTo(tr.x, tr.y);
        });
    }


}

export {Triangle, _HFACTOR};