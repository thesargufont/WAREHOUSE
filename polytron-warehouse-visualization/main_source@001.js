// https://observablehq.com/@mariodelgadosr/warehouse-visualization-with-datavisual@1249
import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./a33468b95d0b15b0@808.js";
import define3 from "./17428bc970543296@1461.js";
import define4 from "./99d748bec11c4235@418.js";
import define5 from "./b6f82daf61c494c8@654.js";
import define6 from "./c6c7a741ac87d656@52.js";
import define7 from "./c2b912d136a0857d@2096.js";

function _title(md){return(
md`# Polytron Warehouse Visualization`
)}

function* _renderedScene(warehouseDataVisual,THREE,boundingBox,camera,width,height,invalidation)
{
  // Lights and background
  warehouseDataVisual.visual.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  warehouseDataVisual.visual.scene.add(
    new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5)
  );
  warehouseDataVisual.visual.scene.background = new THREE.Color("#d9dccb");

  warehouseDataVisual.visual.scene.add(boundingBox);

  camera.far = Math.max(
    10000,
    boundingBox.geometry.boundingSphere.radius * 2.5
  );

  // Position for a bird's eye view of the warehouse
  camera.position.set(
    boundingBox.geometry.boundingSphere.center.x,
    boundingBox.geometry.boundingSphere.radius,
    boundingBox.geometry.boundingSphere.radius * 2.5
  );

  camera.lookAt(
    boundingBox.geometry.boundingSphere.center.x,
    boundingBox.geometry.boundingSphere.center.y,
    boundingBox.geometry.boundingSphere.center.z
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(
    boundingBox.geometry.boundingSphere.center.x,
    boundingBox.geometry.boundingSphere.center.y,
    boundingBox.geometry.boundingSphere.center.z
  );
  controls.maxDistance = boundingBox.geometry.boundingSphere.radius * 4;

  controls.update();

  renderer.setSize(width, height);
  renderer.setPixelRatio(devicePixelRatio);

  const imageDiv = document.createElement("div");
  imageDiv.appendChild(renderer.domElement);

  warehouseDataVisual.addToolTip(renderer, camera);

  // https://observablehq.com/@observablehq/invalidation
  invalidation.then(() => (controls.dispose(), renderer.dispose()));

  while (true) {
    renderer.render(warehouseDataVisual.visual.scene, camera);
    yield imageDiv;
  } // while
}


function _3(visualization,warehouseDataVisual,selColumn,html,d3,legend,width,scaleType,colorScheme)
{
  if (visualization == "Color assigned from data") {
    //https://codeburst.io/javascript-array-distinct-5edc93501dc4
    const distinctColumn = [
      ...new Set(
        warehouseDataVisual.data
          .filter((d) => d[selColumn])
          .map((d) => d[selColumn])
      )
    ];

    return html`Pre-assigned Colors in the Data: ${distinctColumn
      .map(
        (distinctCol) =>
          `<span style="background-color:#918d83;font-weight:bold;color:${distinctCol.toLowerCase()}">&nbsp;${distinctCol}&nbsp;</span>`
      )
      .join(", ")}`;
  } // if
  else {
    const domain = [d3.min(visualization.domain), d3.max(visualization.domain)];

    return legend({
      width: width,
      color: d3["scaleSequential"](domain, colorScheme),
      title: selColumn
    });
  } // else
}


async function _sceneInputs(html,$0,$1,$2,FileAttachment,$3){return(
html`<style>
.grid-container {
  display: grid;
  height: 150px;
  grid-template-areas:
  "gltfURL scaleType   mouse" 
  "colorScheme  colorScheme colorScheme" ;
}
</style>
<div class="grid-container">
  <div class="selColumn">${$0}</div>
  <div class="scaleType">${$1}${$2} </div>
  <div class="mouse">
    <figure style="width:50px;height:20px;">
      ${await FileAttachment("mouse.png").image()}
     <figcaption><a target="_blank" href="https://threejs.org/docs/#examples/en/controls/OrbitControls">Zoom,pan and rotate image</a>
    </figcaption>
    </figure>
  </div>
   <div class="colorScheme">${$3}</div>
</div>

</div>
`
)}

function _5(toc){return(
toc()
)}

function _6(md){return(
md`## Bird's Eye View

The [*DataVisual (Data + Visual) Design Pattern for WebGL 3D Assets*](https://observablehq.com/@mariodelgadosr/datavisual-data-visual-design-pattern-for-webgl-3d-assets) notebook detailed the DataVisual design pattern.

This notebook builds on that pattern with an introduction of a strategy for supply chain managers seeking insight into their warehousing operations.

The same strategy is used in a robust implementation of warehouse visualizations in [*My Warehouse Visualizer*](http://mydatavisualizer.com/demo/warehouse/); a custom/optimized version of the [*My Data Visualizer*](http://mydatavisualizer.com/) for 3D WebGL images.

  [*DataVisual Visualization with Data-Embedded glTF Files*](https://observablehq.com/@mariodelgadosr/datavisual-visualization-with-data-embedded-gltf-files) demonstrates similar functionality with 3D images created in [Blender](http://blender.org) exported to a [glTF](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md) file.

The [interactive WebGL scene](#title) (use mouse to [zoom, pan and rotate](https://threejs.org/docs/#examples/en/controls/OrbitControls)) in this notebook initially displays a 3D warehouse with inventory visualized using the weight (*ITEM WGT*) metric; for light (green) to heavy (red) inventory.   Select other column metrics from the Data Column drop-down for dynamic color scheme visualizations.

Data for the visualization are in a [Google Sheet](https://docs.google.com/spreadsheets/d/14Xwqk9zJxkBt5enYEWTbOPUQrKn0AoMyFYaUePHtk8o/edit#gid=0) that details the dimensions for the warehouse storage slots and calculates whether-or-not the inventory for a designated storage slot is damaged.   The data are accessed with [d3-fetch csv](https://github.com/d3/d3-fetch/blob/v1.1.2/README.md#csv) via the  [Google Sheets API](https://gsuiteupdates.googleblog.com/2015/06/publish-google-sheets-spreadsheets-in.html) that exposes it as a [comma-seperated values](https://en.wikipedia.org/wiki/Comma-separated_values) resource on the web.`
)}

function _7(md){return(
md `## Re-slotting Animation

The re-slotting animation demonstrates one possible benefit of  the 3D visualization of a physical warehouse.  

The logic in the [***visualization***](#visualization) cell determines:

  * The location of warehouse exit on the lower right edge of the visualization;
  * The location of the heaviest item in the inventory;
  * An empty slot that is closest to the exit and at ground level;
  * An animation path to illustrate the re-slotting operation to the new location.
`
)}

async function _8(md,FileAttachment){return(
md`## Layout and Inventory Data in the [***Small Warehouse*** Google Sheet](https://docs.google.com/spreadsheets/d/14Xwqk9zJxkBt5enYEWTbOPUQrKn0AoMyFYaUePHtk8o/edit#gid=0)

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT3XpGLIsLj3cyj4rdraGQggWcjN-eHL4HgHec0gEWGc2g5lZi5q0FRpj-I73CCpYE-lsVeiHmhzeA3/pubhtml?widget=true&amp;headers=false" width=900 height=250></iframe>

* Column *LOCATION* in both the Layout and Inventory pages represents a common key between the datasets.

* Columns *WIDTH*, *DEPTH*, *HEIGHT*, *X*, *Y*, *Z* in the Layout page are the dimensional and spatial attributes for a given storage slot.

* Column *COLOR_CASES DAMAGED* in the Inventory page computes an [HTML Color Name](https://www.w3schools.com/colors/colors_names.asp) as a function of the *CASES DAMAGED* column.  This computed color is parsed from the data in this notebook and is dynamically assigned to the slots in the visualization. 

  * Dynamic color scale assignments are also available with [*My Warehouse Visualizer*](http://MyDataVisualizer.com/demo/warehouse) and in the visualization on this notebook.  For example:

    * The *ITEM WGT* column can create a visualization that helps to quickly identify heavy items located high within a storage bay.

    * To reproduce above, select the *ITEM WGT* column, *RdYlGn (I)* (**I**nverted) color scale to visualize heavier objects on the red end of the coloring scale.  

    * Warehousing best practices seeks to keep heavy items close to the ground for safety and quick storage/retrieval. However, when all the ground-level storage is occupied higher level storage locations are used:

      <img width="900px" alt="Screen Shot of Heavy Inventory Analysis from My Warehouse Visualizer" src="${await FileAttachment("MyWarehouseVisualizerHeavyAnalysis@3.PNG").url()}" />

* Other column attributes associated with the layout and inventory are available for value-added analyses within [*My Warehouse Visualizer*](http://MyDataVisualizer.com/demo/warehouse).  For example:

    * The *LINK_* column is utilized to create a data driven hyperlink referencing a specific row's *LOCATION* attribute value.

    * Column *ITEM NO* is prefixed with '\\s' to instruct the [*My Warehouse Visualizer*](http://MyDataVisualizer.com/demo/warehouse) data load [parser](https://observablehq.com/@d3/d3-autotype) to intrerpret the numeric values in the column as strings.
`
)}

function _9(md){return(
md`## Warehouse Data Retrieved with [d3-fetch csv](https://github.com/d3/d3-fetch/blob/v1.1.2/README.md#csv) from the [Published](https://docs.google.com/spreadsheets/d/14Xwqk9zJxkBt5enYEWTbOPUQrKn0AoMyFYaUePHtk8o/edit#gid=0) Google Sheet CSV Pages: [Layout](https://docs.google.com/spreadsheets/d/e/2PACX-1vT3XpGLIsLj3cyj4rdraGQggWcjN-eHL4HgHec0gEWGc2g5lZi5q0FRpj-I73CCpYE-lsVeiHmhzeA3/pub?gid=0&single=true&output=csv) and [Inventory](https://docs.google.com/spreadsheets/d/e/2PACX-1vT3XpGLIsLj3cyj4rdraGQggWcjN-eHL4HgHec0gEWGc2g5lZi5q0FRpj-I73CCpYE-lsVeiHmhzeA3/pub?gid=377990885&single=true&output=csv)`
)}

async function _layoutData(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("Small Warehouse - Layout.csv").text(), d3.autoType)
)}

async function _inventoryData(d3,FileAttachment)
{ 
  
  // Parse: don't autoType designated string columns
  const parse = o => { 
                       Object.keys(o).forEach(k => o[k] = !k.startsWith("\\s") ? d3.autoType([o[k]])[0] : o[k]) ; 
                       return o;
                     };   
   // inventoryData = await d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vT3XpGLIsLj3cyj4rdraGQggWcjN-eHL4HgHec0gEWGc2g5lZi5q0FRpj-I73CCpYE-lsVeiHmhzeA3/pub?gid=377990885&single=true&output=csv");
  
  // Local file access to deal with network realiablity issues
  const inventoryData = d3.csvParse(await FileAttachment("Small Warehouse - Inventory.csv").text(), parse);
 
  inventoryData.forEach(d => Object.keys(d).filter(k => k.startsWith("LINK_") ).forEach(k => delete d[k]) );  
   
  return inventoryData.map(d => { const o = {}; 
                                   Object.keys(d).forEach(k => o[k.replace("\\s","")] = d[k] ) 
                                   return o;
                                 }); 

  
}


function _12(md){return(
md `## Objects for the Warehouse Visualization`
)}

function _13(md){return(
md`### [three.js](https://threejs.org/) Scene for the Warehouse Visualization Derived from layoutData`
)}

function _warehouseVisual(THREE,layoutData)
{
		// Build a Three.js group of warehouse slots. 
		// The slot geomemtry verticies are built using provided X,Y,Z,WIDTH,DEPTH and HEIGHT

		const warehouse = new THREE.Group();  															
		warehouse.name = "warehouseGroup";
    warehouse.visible = false;
		// console.log(warehouse);											
    // https://www.cloudhadoop.com/2018/08/es6-map-class-tutorials-with-javascript.html
		const geometriesMap = new Map();
		const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5}); 			
	  // console.log(geometriesMap);
	  // console.log(edgeMaterial);
    for (let i = 0; i < layoutData.length; i++) {
				
        const {LOCATION, X, Y, Z, WIDTH, HEIGHT, DEPTH} = layoutData[i];
        const geometryKey = `${WIDTH}:${HEIGHT}:${DEPTH}`;
        // console.log(geometryKey);
        // Re-use unique geometries: https://stackoverflow.com/questions/16820806/three-js-performance		
				if (!geometriesMap.has(geometryKey)) {
          
          const cubeGeometry = new THREE.BoxBufferGeometry(parseFloat(WIDTH), parseFloat(HEIGHT), parseFloat(DEPTH)); 
					const edgeGeometry = 	 new THREE.EdgesGeometry(cubeGeometry);
					geometriesMap.set(geometryKey, {cubeGeometry, edgeGeometry});
				
				} // if
      
        const {cubeGeometry, edgeGeometry} = geometriesMap.get(geometryKey);
 				
				const cubeMaterial = new THREE.MeshBasicMaterial( {transparent: true,  wireframe: false});
						
				const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial); 
				      edge.renderOrder = 0; //https://threejs.org/docs/index.html#api/en/core/Object3D.renderOrder
				
				const pallet = new THREE.Mesh(cubeGeometry, cubeMaterial);
				      pallet.material.opacity = 0.75;
				      pallet.renderOrder = 1;
				
				const slot = new THREE.Group();					
				      slot.add(edge);		//First Child in Group: 0th index		
				      slot.add(pallet);	//Second Child in Group: 1th index		
              slot.name = LOCATION;
              slot.userData = layoutData[i]; 
              //Translatiing slot warehouse coordinates to WebGL screen coordinates
              slot.position.x = parseFloat(X) + (parseFloat(HEIGHT) / 2); 
              slot.position.y = parseFloat(Z) + (parseFloat(DEPTH)  / 2); 							
              slot.position.z = parseFloat(Y) + (parseFloat(HEIGHT) / 2);  
      
              console.log(slot);
				warehouse.add(slot);			
		} // for
    
    const scene = new THREE.Scene()
    scene.add(warehouse);
    
    return {scene: scene};
				
	}


function _15(md){return(
md `### [DataVisual](https://observablehq.com/@mariodelgadosr/datavisual-data-visual-design-pattern-for-webgl-3d-assets) 'Joining' inventoryData to warehouseVisual`
)}

function _warehouseDataVisual(layoutData,inventoryData,dataVisual,warehouseVisual)
{ 
  const emptyLocations = layoutData.filter(l => inventoryData.findIndex(i => i.LOCATION == l.LOCATION) == -1)
                                   .map(l => ({LOCATION: l.LOCATION }) );
  
  return new dataVisual({ data: [...inventoryData, ...emptyLocations],  // full and empty locations
                          visual: warehouseVisual,
                          dataKey: "LOCATION",                          // data's LOCATION attribute 
                          visualKey: "LOCATION"                         // found in slot's .userData
                         });

}


function _visualization(d3,warehouseDataVisual,selColumn,scaleType,colorScheme,visualObjWithHeaviestItem,THREE,boundingBox,bezierPath)
{
  const min = d3.min(warehouseDataVisual.join, (j) => j.dataRow[selColumn]);
  const max = d3.max(warehouseDataVisual.join, (j) => j.dataRow[selColumn]);

  const domain = selColumn.startsWith("COLOR_")
    ? "Color assigned from data"
    : [min, max];

  warehouseDataVisual.join.forEach((join) => {
    const color = selColumn.startsWith("COLOR_")
      ? (c) =>
          join.dataRow[selColumn]
            ? join.dataRow[selColumn].toLowerCase()
            : "white"
      : d3["scaleSequential"](colorScheme).domain(domain);

    warehouseDataVisual.setColorVisualObj(
      join.visualObj,
      color(join.dataRow[selColumn])
    );

    if (Object.keys(join.dataRow).length == 1)
      // Empty location
      join.visualObj.children[1].material.opacity = 0;
  }); // forEach

  warehouseDataVisual.visual.scene.getObjectByName(
    "warehouseGroup"
  ).visible = true;

  // if (curve.path) curve.path.destroy();

  // curve.path = getReSlotPath("curvePath");

  // if (curve.path) {
  //   if (!!simulate) {
  //     curve.path.setColor(
  //       visualObjWithHeaviestItem.children[1].material.color.getHex()
  //     );
  //     curve.path.animate();
  //   } else {
  //     curve.path.destroy();
  //   } // else
  // } // if

  return Array.isArray(domain)
    ? { scale: colorScheme, scaleType: "scaleSequential", domain: domain }
    : domain;

  function getReSlotPath(name) {
    const lowEmptyJoins = warehouseDataVisual.join
      .filter((join) => Object.keys(join.dataRow).length == 1) // 'empty' inventory
      .filter((join) => join.visualObj.userData.Z == 0);

    if (lowEmptyJoins.length == 0) return null;

    const exitLocation = new THREE.Vector3(
      boundingBox.geometry.boundingBox.max.x,
      0,
      boundingBox.geometry.boundingBox.max.z
    );

    const closestEmptyLocationToExitLocation = lowEmptyJoins.reduce(
      (accJoin, join) => {
        return exitLocation.distanceTo(accJoin.visualObj.position) <
          exitLocation.distanceTo(join.visualObj.position)
          ? accJoin
          : join;
      }
    ).visualObj;

    return new bezierPath({
      parent: warehouseDataVisual.visual.scene,
      name: name,
      v1: visualObjWithHeaviestItem.position,
      v2: closestEmptyLocationToExitLocation.position,
      height: boundingBox.geometry.boundingBox.max.y * 5
    });
  } // getReSlotPath
}


function _curve(){return(
{}
)}

function _height(){return(
500
)}

function _camera(width,height,THREE)
{
  const fov = 45;
  const aspect = width / height;
  const near = 0.1;
  const far = 10000;   //Will be set by warehouse visualization logic as a function of the boundingSphere
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  return camera;
}


function _boundingBox(THREE,warehouseDataVisual)
{
  
  const boundingBox = new THREE.BoxHelper(warehouseDataVisual.visual.scene, new THREE.Color( 'black' ));
  boundingBox.geometry.computeBoundingBox(); 
  return boundingBox;
  
}


function _visualObjWithHeaviestItem(warehouseDataVisual,d3){return(
warehouseDataVisual.join
                           .sort((x,y) => d3.descending(x.dataRow["ITEM WGT"], y.dataRow["ITEM WGT"] ))[0].visualObj
)}

function _23(md){return(
md`🢇 Click cell to exapand code for ***viewof scaleType***`
)}

function _scaleType(select)
{
  const scales = "Sequential".split(",");

  const scaleType = select({
    title: "D3 Scaling Logic",
    description: "",
    options: scales.map(s => ({value: "scale" + s , label: s}) ),
    multiple: false,
    value: "scale" + scales[2]
  });

  return scaleType;
}


function _25(md){return(
md`🢇 Click cell to exapand code for ***viewof selColumn***`
)}

function _selColumn(warehouseDataVisual,select)
{
  // Data Columns
  const dataColumns = Object.keys(warehouseDataVisual.data[0])
                      .filter(c => !c.startsWith("\\s"))
                      .filter(c => c.startsWith("COLOR") || 
                                   typeof warehouseDataVisual.data[0][c] != "string" );
  
  const selColumn = select({
    title: "Select Data Column",
    description: "",
    options: dataColumns.map(c => ({value: c, label: c.replace("_", " ")}) ),
    multiple: false,
    //value: dataColumns[dataColumns.findIndex(c => c.startsWith("COLOR"))]
    value: "ITEM WGT"
  });  

  return selColumn;
}


function _27(md){return(
md`🢇 Click cell to exapand code for ***viewof colorScheme***`
)}

function _colorScheme(d3,colorSchemes,colorInterpolatorPicker)
{
    const interpolators = 
          
       d3.range(colorSchemes.length * 2).map(d => {

         if (d % 2 == 0) {
           return (
                    {name: colorSchemes[d / 2].strColorScheme.substring(11)}
                  )
         } else {  
            return (
                    { name: colorSchemes[(d-1)/2 ].strColorScheme.substring(11) + " (I)" ,
                      value: t => colorSchemes[(d-1) /2].fnColorScheme(1-t)
                    } 
                 ) 
          } 
       })           
  
    const colorScheme =
          
          colorInterpolatorPicker(
            { title: "Color Scheme",
             value: "RdYlGn (I)",
             interpolators: interpolators,
             w: 200
            }
          );
  
  
    return colorScheme

}


function _29(md){return(
md`🢇 Click cell to exapand code for ***viewof simulate***`
)}

// function _simulate(checkbox){return(
// checkbox({
//   description: "Simulate re-slotting of heaviest item to lowest slot near exit",
//   options: [{ value: "Show Animation", label: "Animate re-slotting" }],
//   value: "Show Animation"
// })
// )}

function _textDemo(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

async function _THREE(require)
{
  //const version = "0.99.0";
  const version = "0.104.0";
  const THREE = window.THREE = await require('three@' + version + '/build/three.min.js');
  await require('three@' + version + '/examples/js/controls/OrbitControls.js').catch(() => {});
  return THREE;
}


function _40(md){return(
md`### [DataVisual](https://github.com/MarioDelgadoSr/DataVisual) Class`
)}

function _license(md){return(
md `## License

Free to all non-profit organizations.  Businesses and commercial enterprises are granted a full-use license as long as they make their application freely available to non-profits.

`
)}

function _43(md){return(
md `## References`
)}

function _44(md){return(
md `
* [Importing data from Google Spreadsheets into a notebook / webpage](https://observablehq.com/@bryangingechen/importing-data-from-google-spreadsheets-into-a-notebook-we)

* [*My Warehouse Visualizer Documentation*](https://github.com/MarioDelgadoSr/MyWarehouseVisualizerDoc)

* [*My Warehouse Visualizer*](http://mydatavisualizer.com/demo)

* [*My Data Visualizer*](http://mydatavisualizer.com/) 

* [DataVisual Visualization with Data-Embedded glTF Files](https://observablehq.com/@mariodelgadosr/datavisual-visualization-with-data-embedded-gltf-files)
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    // ["MyWarehouseVisualizerHeavyAnalysis@3.PNG", {url: new URL("./files/239d0f0964b8bef20a413a61ca1c47038ba3bb22efa806f1c075af5fcd89250ecfdb95b1aaf38ace197bb944720935c939f7220e779c85e98b4ae83ca2ec7160.png", import.meta.url), mimeType: "image/png", toString}],
    ["Small Warehouse - Layout.csv", {url: new URL("./files/LAYOUT.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["Small Warehouse - Inventory.csv", {url: new URL("./files/INVENTORY.csv", import.meta.url), mimeType: "text/csv", toString}],
    // ["mouse.png", {url: new URL("./files/19ecf0da78a8e72518454d618d989e166135422105ee22bdc6aceb1193b85b2806de2c2a7d059ce2de3dddf927e2b1753e801cd3c86fac01b8857d7e0f53a6a0.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title")).define("title", ["md"], _title);
  main.variable(observer("renderedScene")).define("renderedScene", ["warehouseDataVisual","THREE","boundingBox","camera","width","height","invalidation"], _renderedScene);
  main.variable(observer()).define(["visualization","warehouseDataVisual","selColumn","html","d3","legend","width","scaleType","colorScheme"], _3);
  // main.variable(observer("sceneInputs")).define("sceneInputs", ["html","viewof selColumn","viewof simulate","viewof scaleType","FileAttachment","viewof colorScheme"], _sceneInputs);
  // main.variable(observer()).define(["toc"], _5);
  // main.variable(observer()).define(["md"], _6);
  // main.variable(observer()).define(["md"], _7);
  // main.variable(observer()).define(["md","FileAttachment"], _8);
  // main.variable(observer()).define(["md"], _9);
  main.variable(observer("layoutData")).define("layoutData", ["d3","FileAttachment"], _layoutData);
  main.variable(observer("inventoryData")).define("inventoryData", ["d3","FileAttachment"], _inventoryData);
  // main.variable(observer()).define(["md"], _12);
  // main.variable(observer()).define(["md"], _13);
  
  main.variable(observer("warehouseVisual")).define("warehouseVisual", ["THREE","layoutData"], _warehouseVisual);
  // main.variable(observer()).define(["md"], _15);
  main.variable(observer("warehouseDataVisual")).define("warehouseDataVisual", ["layoutData","inventoryData","dataVisual","warehouseVisual"], _warehouseDataVisual);
  main.variable(observer("visualization")).define("visualization", ["d3","warehouseDataVisual","selColumn","scaleType","colorScheme","visualObjWithHeaviestItem","THREE","boundingBox","bezierPath"], _visualization);
  // main.variable(observer("curve")).define("curve", _curve);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("camera")).define("camera", ["width","height","THREE"], _camera);
  main.variable(observer("boundingBox")).define("boundingBox", ["THREE","warehouseDataVisual"], _boundingBox);
  main.variable(observer("visualObjWithHeaviestItem")).define("visualObjWithHeaviestItem", ["warehouseDataVisual","d3"], _visualObjWithHeaviestItem);
  // main.variable(observer()).define(["md"], _23);
  main.variable(observer("viewof scaleType")).define("viewof scaleType", ["select"], _scaleType);
  main.variable(observer("scaleType")).define("scaleType", ["Generators", "viewof scaleType"], (G, _) => G.input(_));
  // main.variable(observer()).define(["md"], _25);
  main.variable(observer("viewof selColumn")).define("viewof selColumn", ["warehouseDataVisual","select"], _selColumn);
  main.variable(observer("selColumn")).define("selColumn", ["Generators", "viewof selColumn"], (G, _) => G.input(_));
  // main.variable(observer()).define(["md"], _27);
  main.variable(observer("viewof colorScheme")).define("viewof colorScheme", ["d3","colorSchemes","colorInterpolatorPicker"], _colorScheme);
  main.variable(observer("colorScheme")).define("colorScheme", ["Generators", "viewof colorScheme"], (G, _) => G.input(_));
  // main.variable(observer()).define(["md"], _29);
  // main.variable(observer("viewof simulate")).define("viewof simulate", ["checkbox"], _simulate);
  // main.variable(observer("simulate")).define("simulate", ["Generators", "viewof simulate"], (G, _) => G.input(_));
  // main.variable(observer("textDemo")).define("textDemo", ["md"], _textDemo);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);

  const child1 = runtime.module(define1);
  main.import("select", child1);
  main.import("checkbox", child1);
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  const child3 = runtime.module(define3);
  main.import("colorInterpolatorPicker", child3);
  const child4 = runtime.module(define4);
  main.import("colorSchemes", child4);
  const child5 = runtime.module(define5);
  main.import("bezierPath", child5);
  const child6 = runtime.module(define6);
  main.import("toc", child6);
  // main.variable(observer()).define(["md"], _40);
  const child7 = runtime.module(define7);
  main.import("dataVisual", child7);
  // main.variable(observer("license")).define("license", ["md"], _license);
  // main.variable(observer()).define(["md"], _43);
  // main.variable(observer()).define(["md"], _44);
  return main;
}
