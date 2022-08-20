// https://observablehq.com/@mariodelgadosr/animated-three-js-3d-quadratic-bezier-curves@654
import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Animated Three.js [3D Quadratic Bezier Curves](https://threejs.org/docs/index.html#api/en/extras/curves/QuadraticBezierCurve3)`
)}

function* _demo(THREE,invalidation,camera,width,height,frequency,scene,d3,gridHelperSize,bezierPath,sceneHeight,mode)
{
  
  const renderer = new THREE.WebGLRenderer({antialias: true});
  
  invalidation.then(() => renderer.dispose());
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  renderer.setSize(width, height);
  renderer.setPixelRatio(devicePixelRatio);
  
  let randomPath =  getRandomPath();   
  let startTime =  new Date();
  let elapsedTime;

  while (true) {
  
    elapsedTime =  new Date() - startTime;
    if (elapsedTime >= (1000 * frequency) * 1.5) {       
                  randomPath.destroy();  
                  randomPath = getRandomPath();
                  startTime =  new Date();
    }
   
    renderer.render(scene, camera);
    
    yield renderer.domElement;
    
  } // while
  
  function getRandomPath(){
    
    const getRandom = () => d3.interpolate(-gridHelperSize/2, gridHelperSize/2)(Math.random()); 

    const path = new bezierPath({ parent: scene, 
                            v1: new THREE.Vector3(getRandom(), 0, getRandom() ), 
                            v2: new THREE.Vector3(getRandom(), 0, getRandom() ), 
                            frequency,
                            height: d3.interpolate(sceneHeight * 2, sceneHeight * 4)(Math.random()), 
                            color: d3.interpolateRainbow(Math.random())
                          }); 
    
    path[mode]();
    
    return path;
  
  } // getRandomPath
    
}


function _mode(radio){return(
radio({
  title: 'Mode',
  description: 'Select random curve path mode',
  options: [
    { label: 'Animate', value: 'animate' },
    { label: 'Display', value: 'display' }
  ],
  value: 'animate'
})
)}

function _frequency(slider){return(
slider({
  min: .5, 
  max: 3, 
  step: .1, 
  value: 1, 
  title: "Frequency",
  description: "Curve path draw cycle in seconds"
})
)}

function _5(md){return(
md `## bezierPath class`
)}

function _bezierPath(THREE){return(
class bezierPath {
  
    constructor (config={}) {  
    
      let { parent, 
            name, 
            v1, 
            v2, 
            frequency = 1, 
            frameRate = 60, 
            height, 
            color = 0xffffff
           } = config;
    
      //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
      this.frameRate = frameRate;       
      
      this.parent = parent;
      this.curveGroup = new THREE.Group();
      if (name) this.curveGroup.name = name;
      this.curveGroup.visible =  false;  
      this.currentSegment = -1;
      this.animationFrame = undefined; 
           
      const middleVector = new THREE.Vector3().addVectors(v1,v2).divideScalar(2);
      
      middleVector.setComponent( 1, height );
      
      const curve = new THREE.QuadraticBezierCurve3(
                      v1.applyMatrix4(parent.matrixWorld),
                      middleVector.applyMatrix4(parent.matrixWorld),
                      v2.applyMatrix4(parent.matrixWorld)
                    );


      const numPoints =  Math.max(Math.floor((frameRate / 2) * frequency),15);
      
      const points = curve.getPoints(numPoints);
      
      const material = new THREE.LineBasicMaterial( { color: color } ); 
     
      for (let i = 0; i < points.length - 1; i++) {
          const geometry =  new THREE.BufferGeometry().setFromPoints( [ points[i], points[i + 1] ] ); 
          const curveSegment = new THREE.Line( geometry, material);
          this.curveGroup.add(curveSegment);
      }  // for
           
      parent.add(this.curveGroup);
 
  } // constructor

  
  animate(){
    
      let start;
      let currentSegment = this.currentSegment;
      let curveGroup = this.curveGroup;
      const framRate = this.frameRate;
      
      this.hide();
      curveGroup.visible = true;
    
      this.animationFrame = window.requestAnimationFrame(step); 
      let animationFrame = this.animationFrame;
    
      function step(timestamp) {
        
          if (start === undefined) 
            start = timestamp;
          const elapsed = timestamp - start;

        if (elapsed >= (1000 / framRate) && curveGroup.visible ) {
          currentSegment = 
              currentSegment < curveGroup.children.length - 1  ? ++currentSegment : 0;
          curveGroup.children[currentSegment].visible = 
              !curveGroup.children[currentSegment].visible;
          start = timestamp; 
        }
        
        if (curveGroup.visible) 
          animationFrame = window.requestAnimationFrame(step);  
        
      }

  
    
  } //animate  
  
  destroy() {
    window.cancelAnimationFrame(this.animationFrame);
    this.parent.remove(this.curveGroup); 
  } // destroy

  display() {
    window.cancelAnimationFrame(this.animationFrame);
    this.curveGroup.traverse( curveSegment => curveSegment.visible = true );
  } // hide  
  
  hide() {
    window.cancelAnimationFrame(this.animationFrame);
    this.curveGroup.traverse( curveSegment => curveSegment.visible = false );
  } // hide  
  
  setColor(color){
    this.curveGroup.traverse(curveSegment => curveSegment.material ? curveSegment.material.color.set(color) : null)  
  } // setColor 

}
)}

function _7(md){return(
md `## Usage

~~~js 
import {bezierPath} from "@mariodelgadosr/animated-three-js-3d-quadratic-bezier-curves"
~~~

**Syntax**: 

~~~js  
const path = new bezierPath(config) 
~~~
Instantiates an animatable curve path; where config is an [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) with the following properties: 

Property | Description
-------- | -----------
  *parent* | The [Object3D](https://threejs.org/docs/index.html#api/en/core/Object3D) bezierPath will be appended to.
  *name* | A unique name for the curve path that can be used with [*getObjectByName*](https://threejs.org/docs/index.html#api/en/core/Object3D) to reference the parent [*group*](https://threejs.org/docs/index.html#api/en/objects/Group) hosting the curve line segments. Optional.
  *v1* | [Vector3](https://threejs.org/docs/index.html#api/en/math/Vector3) start location for curve path.
  *v2* | [Vector3](https://threejs.org/docs/index.html#api/en/math/Vector3) end location for curve path.
  *height* | The height of the mid-point of the curve.
  *frequency* | The frequqency cycle per second for a complete animation of the curve path. Determines [number of pieces](https://threejs.org/docs/index.html#api/en/extras/core/Curve.getPoints) to divide the curve path into. Optional: default is 1.
  *framerate* | The animation per second frame refresh rate. Default: 60. See: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
  *color* | The curve path's [color](https://threejs.org/docs/index.html#api/en/math/Color). Optional: default is 0xffffff (black);
<br/>
The class instance has the following methods:

Method | Description
-------| -----------
 *.anmiate()* | Toggles the visibility of the next section of curve path.
 *.display()* | Displays the complete curve path without the animation effect.
 *.hide()* | Hides the curve path; invoke *animate* or *display* method to re-activate.
 *.setColor(color)* | Sets the curves paths's color to [*color*](https://threejs.org/docs/index.html#api/en/math/Color).
 *.destroy()* |Destroys the curve path and removes it from its parent.


`
)}

function _8(md){return(
md `## Use Case

See [Warehouse Visualization with DataVisual](https://observablehq.com/@mariodelgadosr/warehouse-visualization-with-datavisual)'s re-slotting simulation.`
)}

function _9(md){return(
md `## Objects used with demo visualization`
)}

function _height(width){return(
width / 1.618
)}

function _sceneHeight(){return(
1
)}

function _gridHelperSize(sceneHeight){return(
sceneHeight * 10
)}

function _scene(frequency,mode,THREE,gridHelperSize)
{
  frequency || mode;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  
  scene.add( new THREE.GridHelper( gridHelperSize, gridHelperSize ));
  return scene;
}


function _camera(width,height,boundingBox,THREE)
{
  const fov = 45;
  const aspect = width / height;
  const near = 1;
  const far = Math.max(10000,boundingBox.geometry.boundingSphere.radius * 2);
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // Position for a bird's eye view of the warehouse
  camera.position.set(boundingBox.geometry.boundingSphere.center.x, 
                      boundingBox.geometry.boundingSphere.radius , 
                      boundingBox.geometry.boundingSphere.radius * 1.5); 

  camera.lookAt(boundingBox.geometry.boundingSphere.center.x,
                boundingBox.geometry.boundingSphere.center.y,
                boundingBox.geometry.boundingSphere.center.z);    
  
  
  
  
  
  
  return camera;
}


function _boundingBox(THREE,sceneHeight,scene)
{
  
  //Cube is used temporarily to set size of boundingBox
  const geometry = new THREE.BoxGeometry(1, sceneHeight, 1);
  geometry.translate(0, sceneHeight / 2, 0);
  const cube =  new THREE.Mesh(geometry, new THREE.MeshBasicMaterial()); 
  
  scene.add(cube);

  const boundingBox = new THREE.BoxHelper(scene, 0x000000);
  boundingBox.geometry.computeBoundingBox();  
  boundingBox.geometry.translate( 0, Math.abs(boundingBox.geometry.boundingBox.min.y) ,0 )

  scene.add(boundingBox);
  
  scene.remove(cube);
  
  return boundingBox;  
  
}


async function _THREE(require)
{
  const version = "0.104.0";
  const THREE = window.THREE = await require('three@' + version + '/build/three.min.js');
  await require('three@' + version + '/examples/js/controls/OrbitControls.js').catch(() => {});
  return THREE;
}


function _d3(require){return(
require("d3@5")
)}

function _license(md){return(
md `## License: 

Free to all non-profit organizations.  Businesses can [email](mailto:MyDataVisualizer@gmail.com) for licence details. 

`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("demo")).define("demo", ["THREE","invalidation","camera","width","height","frequency","scene","d3","gridHelperSize","bezierPath","sceneHeight","mode"], _demo);
  main.variable(observer("viewof mode")).define("viewof mode", ["radio"], _mode);
  main.variable(observer("mode")).define("mode", ["Generators", "viewof mode"], (G, _) => G.input(_));
  main.variable(observer("viewof frequency")).define("viewof frequency", ["slider"], _frequency);
  main.variable(observer("frequency")).define("frequency", ["Generators", "viewof frequency"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("bezierPath")).define("bezierPath", ["THREE"], _bezierPath);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("height")).define("height", ["width"], _height);
  main.variable(observer("sceneHeight")).define("sceneHeight", _sceneHeight);
  main.variable(observer("gridHelperSize")).define("gridHelperSize", ["sceneHeight"], _gridHelperSize);
  main.variable(observer("scene")).define("scene", ["frequency","mode","THREE","gridHelperSize"], _scene);
  main.variable(observer("camera")).define("camera", ["width","height","boundingBox","THREE"], _camera);
  main.variable(observer("boundingBox")).define("boundingBox", ["THREE","sceneHeight","scene"], _boundingBox);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("radio", child1);
  main.variable(observer("license")).define("license", ["md"], _license);
  return main;
}
