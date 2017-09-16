# Task
This application is to demonstrate the sierpinski triangle with zoom and pan effects.

# Solution
To increase the performance of page and better UX I have implemented this task as combination of cache and web worker.
Code is written using ES6 and compiled into native JS using 'gulp-babel'

## Execution order 

* Cached triangle objects gird of 3^3 triangles each.

* Animation event loop it used to passed the information about canvas to a web worker

* Web worker will perform the background processing to create triangles based on the values for the canvas size, scale 
and position. The logic that I have used is
    * To mark any triangle hidden that is completely out of the current size of the canvas. This improves the loading speed.
    * To merge if size <= 200px
    * To Split if size >= 300px
    * To return only the objects that are visible*   To improve loading any triangle that completely out of current size
    is marked as hidden to improve loading speed 
    
* Based on the values sent by web worker, cached triangles are placed on their positions and the remaining triangles are marked as hidden (to reduce the painting time)


## Optimisation
The latest version has been optimised to enhance the animation loop by calling the web worker only when needed e.g.

- Once the initial grid is loaded and user did not do any action, don't invoke web worker.
- Only invoke the web worker on zoom/pan interactions

# Setup
To setup application just run following command

``
npm install
``

# Run

## Dev Server
To run local server with browser sync please use following gulp task

``
gulp dev:server
``

## Create build
To create build run following task this will minified the js to increase loading speed 

``
gulp build
``

