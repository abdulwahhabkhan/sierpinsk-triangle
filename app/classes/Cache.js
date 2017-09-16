/**
 * @class Cache
 * @description this will create cached triangles that will be used to display sierpinski triangle
 * on run time and triangle position data will be provided by web worker
 */

import {Triangle} from './Triangle';

class  Cache{

    /**
     * constructor
     * @param opt {stage: pixi.container to drawings, limit: max no. of triangle grid}
     */
    constructor(opt){
        this.stage = opt.stage;
        this.limit = opt.limit || 2000;
    }

    /**
     * build triangles grid and add to stage
     */
    build(){
        var triangle = new Triangle({visible: true, width:300});
        for(var i=0; i<this.limit; i++){
            this.stage.addChild(triangle.buildTriangleGrid());
        }
    }
}

export {Cache}