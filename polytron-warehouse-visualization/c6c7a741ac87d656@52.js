// https://observablehq.com/@mbostock/toc@52
function _1(md){return(
md`# TOC

This notebook can generate a table of contents automatically for your notebook.

\`\`\`js
import {toc} from "@mbostock/toc"
\`\`\`

Here’s an example:`
)}

function _2(toc){return(
toc()
)}

function _3(md){return(
md`## Implementation`
)}

function _toc(Generators,html,DOM,MutationObserver){return(
function toc(selector = "h1,h2,h3", heading = "<b>Table of Contents</b>") {
  return Generators.observe(notify => {
    let headings = [];

    function observed() {
      const h = Array.from(document.querySelectorAll(selector));
      if (h.length !== headings.length || h.some((h, i) => headings[i] !== h)) {
        notify(html`${heading}<ul>${Array.from(headings = h, h => {
          return Object.assign(
            html`<li><a href=#${h.id}>${DOM.text(h.textContent)}`,
            {onclick: e => (e.preventDefault(), h.scrollIntoView())}
          );
        })}`);
      }
    }

    const observer = new MutationObserver(observed);
    observer.observe(document.body, {childList: true, subtree: true});
    observed();
    return () => observer.disconnect();
  });
}
)}

function _5(md){return(
md`## Hooray

It worked!`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["toc"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("toc")).define("toc", ["Generators","html","DOM","MutationObserver"], _toc);
  main.variable(observer()).define(["md"], _5);
  return main;
}
