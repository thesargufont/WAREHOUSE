// https://observablehq.com/@mariodelgadosr/collapsibletree@593
import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# collapsibleTree`
)}

function _gltfURL(select,md)
{
  const baseURL = "https://raw.githubusercontent.com/MarioDelgadoSr/MyDataVisualizerDoc/master/repository/";
  const gltfString = "Plane,Body,Chicken,Forklift,Ship,Truck";
  const gltfs = gltfString.split(",");
  
  const gltfURL = select({
    title: md`Select [glTF](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md) to display in tree`,
    description: "",
    options: gltfs.map(g => ({value: baseURL + g + "EmbeddedData.gltf", label: g }) ),
    multiple: false,
    value: baseURL + gltfs[0] + "EmbeddedData.gltf"
  });
  
  return gltfURL;
  
}


function _labelTransform(checkbox){return(
checkbox({

  options: [{ value: "transform", label: "With labelTransform function: {label: d => d.data.type + ': ' + d.data.name}" }],
  value: "transform"
})
)}

function _4(labelTransform,collapsibleTree,data){return(
!!labelTransform ? 
      collapsibleTree({data: data, labelTransform: {label: d => d.data.type + ": " + d.data.name} , dx: 20 }) :
        collapsibleTree({data: data})
)}

function _collapsibleTree(width,d3){return(
function collapsibleTree(config = {}){
  
  let {data, labelTransform = {label: d => d.data.name }, dx = 10,dy = width /6 } = config;
  
  const margin = ({top: 10, right: 120, bottom: 10, left: 40});
  
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  const tree = d3.tree().nodeSize([dx, dy])

  const root = d3.hierarchy(data);
  
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "12px sans-serif")
      .style("user-select", "none");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", d => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(labelTransform.label)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();

}
)}

function _6(md){return(
md `## Usage

This version of the [Collapsible Tree](https://observablehq.com/@d3/collapsible-tree) exposes the function **collapsibleTree(configObject)** where:

  * **configObject** is an object with the following properties:

    * ***data*** (required): an object in a format that can be transformed by the [d3.hierarchy](https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#hierarchy) method.

    * ***labelTransform*** (optional): a function that will use a tree node's properties to construct its label.

    * ***dx*** (optional):  [x node size attributes](https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#tree_nodeSize).

    * ***dy*** (optional):  [y node size attributes](https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#tree_nodeSize).

**Import syntax**: 

~~~js
import {collapsibleTree} from "@mariodelgadosr/collapsibletree"
~~~
`
)}

function _7(md){return(
md `## Use Cases

* [DataVisual Visualization with Data-Embedded glTF Files](https://observablehq.com/@mariodelgadosr/datavisual-visualization-with-data-embedded-gltf-files)

* [Data Visualization of Randomly Assigned Values to Objects in glTF Files](https://observablehq.com/@mariodelgadosr/data-visualization-of-randomly-assigned-values-to-objects)
`
)}

function _8(md){return(
md `## Notebook Objects and Imports`
)}

async function _data(THREE,gltfURL)
{ 
  
  const gltfLoader = new THREE.GLTFLoader();
  
  const loadedGLTF = await new Promise((resolve, reject) => {
                              gltfLoader.load(gltfURL, gltfFile => {      
                                if (gltfFile) resolve(gltfFile);
                                else reject(new Error("load failed"));
                              });
                         });  
  
  /* Alternate pattern when you want to load gltf json to object and then parse it
  
  const gltfJSON = await d3.json(gltfURL);
  
  //https://threejs.org/docs/index.html#examples/en/loaders/GLTFLoader

  const gltfJSONstringify = JSON.stringify(gltfJSON);
  const loadedGLTF = 
        await new Promise(
                    resolve => gltfLoader.parse(gltfJSONstringify,"", loadedGLTF => resolve(loadedGLTF))
                    );
  */
  
  return loadedGLTF.scene;                 

}


function _d3(require){return(
require("d3@5")
)}

async function _THREE(require)
{
  const version = '0.104.0';  
  const THREE = window.THREE = await require('three@' + version + '/build/three.min.js');
  await require('three@' + version + '/examples/js/loaders/GLTFLoader.js').catch(() => {});
  return THREE;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof gltfURL")).define("viewof gltfURL", ["select","md"], _gltfURL);
  main.variable(observer("gltfURL")).define("gltfURL", ["Generators", "viewof gltfURL"], (G, _) => G.input(_));
  main.variable(observer("viewof labelTransform")).define("viewof labelTransform", ["checkbox"], _labelTransform);
  main.variable(observer("labelTransform")).define("labelTransform", ["Generators", "viewof labelTransform"], (G, _) => G.input(_));
  main.variable(observer()).define(["labelTransform","collapsibleTree","data"], _4);
  main.variable(observer("collapsibleTree")).define("collapsibleTree", ["width","d3"], _collapsibleTree);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("data")).define("data", ["THREE","gltfURL"], _data);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  const child1 = runtime.module(define1);
  main.import("select", child1);
  main.import("checkbox", child1);
  return main;
}
