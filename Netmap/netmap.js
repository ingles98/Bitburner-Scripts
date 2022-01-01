/**
 * Netmap tool by Stigma (github/ingles98)
 * 
 * Automatically scans and maps the entire network PLUS interaction with servers (connect to, get running processes, get information, manual backdoor...).
 * 
 * Using Cytoscape.js to create the diagram in the DOM. There is an ESM build that should work out of the box.
 * Also using Cytoscape-CxtMenu (Contextual menu extension), however this one is tricky to implement due to be built targetting UMD and seemingly not being
 * properly imported. Had to build my own version targetting "window" (on Webpack) with the `library.name = "cytoscapeCxtmenu" `.
 * 
 * How it works:
 * - At the start, this script will search for all neighbours from "home" and check those neighbour's neighbours themselves recursively.
 * - An array with all found "Nodes" (Servers really) and another array with NodeConnections (relations) are used to not only store this information
 * but also make sure we dont bubble back from a neighbour to a previously already computed Node.
 * - This search shouldn't take long and the DOM is created with an interactive diagram.
 * 
 * There is a lot of little things that I will want to have implemented like hiding/showing the map window, getting the color scheme from the game itself,
 * and possibly better way to display certain useful gameplay information through the node's aspect.
 * 
 * Currently a node can have:
 * - Either a Green or Red body, represeting whether a node has been backdoored or not.
 * - Green or Red border, representing whether you have root access or not.
 * - Yellow text whether you're currently connected to that node.
 * 
 * The diagram automatically updates every dozens of milliseconds to get servers information for a more interactive experience.
 * If for some reason it lags while using the Netmap you might want to consider looking into the timings or whether you need it to keep refreshing.
 * 
 * Currently this script is in very early stages and a lot of optimizations can probably be done.
 * 
 */

 import {dragElement, elementFromHTML} from "DOM_utils.js"

 if (!globalThis._cytoscape)
   globalThis._cytoscape = (await import('https://unpkg.com/cytoscape@3.20.0/dist/cytoscape.esm.min.js')).default
 
 import "cytoscape-cxtmenu.js"
 
 globalThis._cytoscape.use(globalThis.cytoscapeCxtmenu)
 
 const FONT_FAMILY = `"Lucida Console", "Lucida Sans Unicode", "Fira Mono", Consolas, "Courier New", Courier, monospace, "Times New Roman"`
 
 const CY_ELEMENT_ID = "custom-cy"
 
 const NODES = []
 const NODE_CONNECTIONS = []
 
 var MAIN_CY = null
 
 class Node {
     server = ""
     neighbours = []
     path = []
 
     constructor(server) {
         this.server = server
         this.neighbours = []
     }
 
     toString() {
         return `Node{${this.server}}`
     }
 }
 
 class NodeConnection {
     members = []
 
     constructor(...args) {
         this.members = [...args]
     }
 
     toString() {
         return `NodeConnection{${this.members[0]} - ${this.members[1]}}`
     }
 }
 
 /** @param {NS} ns **/
 export async function main(ns) {
     ns.disableLog("scan")
     await init(ns)
     ns.atExit( () => {
         document.getElementById(CY_ELEMENT_ID+"_wrapper").remove()
     })
 
     while (true) {
         await ns.asleep(500)
         if (MAIN_CY) {
             refreshCy(ns, MAIN_CY)
         }
     }
 }
 
 /** @param {NS} ns **/
 function recursiveScan(ns, target = "", depth = 0, path = []) {
     if (!target)
         return null
     var node = new Node(target)
     const existingNode = NODES.find(n => n.server == target)
     if (existingNode) {
         node = existingNode
         return node
     } else {
         NODES.push(node)
     }
     path.push(node)
     node.path = [...path]
     const targetNeighbours = ns.scan(target)
     for (var neighbour of targetNeighbours) {
         const neighbourNode = recursiveScan(ns, neighbour, depth+1, [...path])
         if (!neighbourNode) {
             continue
         }
         node.neighbours.push(neighbourNode)
         var connection = new NodeConnection(node, neighbourNode)
         const existingConnection = NODE_CONNECTIONS
             .find(nc => nc.members.find(n => n.server == node.server) && nc.members.find(n => n.server == neighbourNode.server))
         if (!existingConnection) {
             NODE_CONNECTIONS.push(connection)
         }
     }
     ns.print(`Found node: "${target}" - Neighbours: ${targetNeighbours}`)
     return node
 }
 
 /** @param {NS} ns **/
 function getCyElements(ns) {
     return [
         ...NODES.map(n => {
             const serverStats = ns.getServer(n.server)
             return {
                 data: {
                     id: n.server,
                     _background: serverStats.backdoorInstalled ? 'lime' : 'red',
                     _foreground: serverStats.isConnectedTo ? 'yellow' : 'white',
                     _border: serverStats.hasAdminRights ? 'lime' : 'red',
                     _serverStats: serverStats,
                     _path: n.path,
                 }
             }
         }),
         ...NODE_CONNECTIONS.map(nc => {
             const a = nc.members[0]
             const b = nc.members[1]
             return {data: { id: `${a.server}-${b.server}`, source: a.server, target: b.server}}
         })
     ]
 }
 
 /** @param {NS} ns **/
 function refreshCy(ns, cy) {
     const newDataMap = new Map()
     const newData = getCyElements(ns)
     newData.forEach(d => {
         if (!d.data.target) {
             newDataMap.set(d.data.id, d.data)
         }
     })
     cy.elements().forEach(cyElem => {
         if (newDataMap.has(cyElem.data().id)) {
             cyElem.data(newDataMap.get(cyElem.data().id))
         }
     })
 }
 
 /** @param {NS} ns **/
 async function init(ns) {
     NODES.splice(0, NODES.length)
     NODE_CONNECTIONS.splice(0, NODE_CONNECTIONS.length)
     const node = recursiveScan(ns, "home")
     ns.print(`Nodes: ${NODES.length} - Connections: ${NODE_CONNECTIONS.length}`)
 
     const goToServer = (node, commands = "") => {
         const path = node.data()._path
         const terminalInput = document.getElementById("terminal-input")
         var connectCmds = path.slice(1).map(n => `connect ${n.server}`).join(";")
         terminalInput.value = `home;${connectCmds}${commands ? ";" + commands : ''}`
         const handler = Object.keys(terminalInput)[1]
         terminalInput[handler].onChange({target:terminalInput})
         terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null})
 
         return refreshCy(ns, cy)
     }
 
     const CY_ELEM_WIDHT = 900
     const CY_ELEM_HEIGHT = 600
 
     var cyElemWrapper = document.getElementById(CY_ELEMENT_ID+"_wrapper")
     if (!cyElemWrapper) {
         cyElemWrapper = document.createElement("div")
         cyElemWrapper.style.top = `calc(50vh - ${Math.ceil(CY_ELEM_HEIGHT/2)}px)`
         cyElemWrapper.style.left = `calc(50vw - ${Math.ceil(CY_ELEM_WIDHT/2)}px)`
     } else {
         cyElemWrapper.innerHTML = ""
     }
 
     //cyElemWrapper
         cyElemWrapper.id = CY_ELEMENT_ID+"_wrapper"
         cyElemWrapper.style.position = "fixed"
         cyElemWrapper.style.zIndex = 1200
         cyElemWrapper.style.border = "1px solid lime"
         cyElemWrapper.style.textAlign = "center"
         cyElemWrapper.style.background = "rgba(0,0,0,0.5)"
         cyElemWrapper.style.width = CY_ELEM_WIDHT+"px"
         cyElemWrapper.style.height = CY_ELEM_HEIGHT+"px"
         cyElemWrapper.style.display = "flex"
         cyElemWrapper.style.flexDirection = "column"
         cyElemWrapper.style.flex = "1"
         cyElemWrapper.style.resize = "both"
         cyElemWrapper.style.overflow = "hidden"
 
     const cyElemHeader = document.createElement("div")
         cyElemHeader.id = cyElemWrapper.id+"_header"
         cyElemHeader.style.display = "flex"
         cyElemHeader.style.flexDirection = "row"
         cyElemHeader.style.justifyContent = "center"
         cyElemHeader.style.alignItems = "center"
         cyElemHeader.style.padding = "10px"
         cyElemHeader.style.width = "100%"
         cyElemHeader.style.boxSizing = "border-box"
         cyElemHeader.style.height = "fitcontent"
         cyElemHeader.style.cursor = "move"
         cyElemHeader.style.zIndex = cyElemWrapper.style.zIndex +1
         cyElemHeader.style.background = "lime"
         cyElemHeader.style.color = "black"
         cyElemHeader.style.fontFamily = FONT_FAMILY
         cyElemHeader.innerHTML = `<span><b>Mapa Múndi</b></span>`
 
         const refreshButton = elementFromHTML(`<button style="margin: auto; margin-right: 0;"></button>`)
             refreshButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/></svg>`
             refreshButton.onclick = (ev) => {
                 init(ns)
             }
         cyElemHeader.appendChild(refreshButton)
 
         const closeButton = elementFromHTML(`<button style="margin: auto 0;">x</button`)
             closeButton.onclick = (ev) => {
                 ns.exit()
             }
         cyElemHeader.appendChild(closeButton)
 
     const cyElem = document.createElement("div")
         cyElem.id = CY_ELEMENT_ID
         cyElem.style.background = "none"
         cyElem.style.display = "flex"
         cyElem.style.flex = 1
         cyElem.style.textAlign = "left"
 
     cyElemWrapper.appendChild(cyElemHeader)
     cyElemWrapper.appendChild(cyElem)
 
     const anchor = document.getElementById("root")
     anchor.appendChild(cyElemWrapper)
     dragElement(cyElemWrapper)
 
     const layoutOptions = {
         name: 'breadthfirst',
         padding: 3,
         fit: true,
         boundingBox: { x1: -250, y1: -5, x2: 250, y2: 5 },
         animate: true,
         animationDuration: 500,
         nodeDimensionsIncludeLabels: true,
         levelWidth: function( nodes ){
             return nodes.maxDegree() / 4;
         },
         concentric: function( node ){
             return node.degree();
         },
         spacingFactor: 0.75,
     }
 
     let cxtMenuOptions = {
         menuRadius: function(ele){ return 75; },
         selector: 'node',
         commands: [
             {
                 // fillColor: 'rgba(200, 200, 200, 0.75)',
                 content: 'Manual Backdoor',
                 contentStyle: {
                     fontFamily: FONT_FAMILY,
                     fontSize: "0.7em"
                 },
                 select: function(ele){
                     const serverStats = ele.data()._serverStats
                     console.log("WTF?", serverStats.hasAdminRights, serverStats)
                     if (serverStats.hasAdminRights && !serverStats.backdoorInstalled) {
                         console.log( ele.id() )
                         goToServer(ele, "backdoor")
                     } else {
                         if (!serverStats.hasAdminRights) {
                             ns.toast(`Cannot Manual Backdoor on ${ele.id()}. Reason: "No root access."`, "error")
                         } else {
                             ns.toast(`Backdoor already installed on ${ele.id()}.`, "info")
                         }
                     }
                 },
                 enabled: true,
             },
             {
                 fillColor: "rgba(0, 150, 260, 0.5)",
                 content: 'System Information',
                 contentStyle: {
                     fontFamily: FONT_FAMILY,
                     fontSize: "0.7em"
                 },
                 select: function(ele){
                     const info = ns.getServer(ele.id())
                     var infoStr = `<div style="display: 'flex'; width: '100%'"><span style="text-align: 'center';"><b>${ele.id()}</b> Server Info:</span></div><br>`
                     infoStr += "<table><tr><th>Key</th><th>Value</th></tr>"
                     for (var [key, value] of Object.entries(info)) {
                         infoStr += `<tr><td>${key}</td><td>${value}</td>`
                     }
                     infoStr += "</table>"
                     ns.alert(infoStr)
                 },
                 enabled: true
             },
             {
                 fillColor: "rgba(255, 0, 0, 0.5)",
                 content: 'Task Manager',
                 contentStyle: {
                     fontFamily: FONT_FAMILY,
                     fontSize: "0.7em"
                 },
                 select: function(ele){
 
                     const ps = ns.ps(ele.id())
                     var infoStr = `<div style="display: 'flex'; width: '100%'"><span style="text-align: 'center';"><b>${ele.id()}</b> Task Manager:</span></div><br>`
                     infoStr += "<table><tr><th>Process</th><th>ID</th><th>Arguments</th><th>Threads</th></tr>"
                     for (var psInfo of ps) {
                         infoStr += `<tr><td>${psInfo.filename}</td><td>${psInfo.pid}</td><td>${psInfo.args}</td><td>${psInfo.threads}</td>`
                     }
                     infoStr += "</table><br>"
                     ns.alert(infoStr)
                 },
                 enabled: true
             },
         ],
         fillColor: 'rgba(0, 255, 0, 0.5)',
         activeFillColor: 'rgba(0, 255, 0, 0.8)',
         activePadding: 10,
         indicatorSize: 10,
         separatorWidth: 5,
         spotlightPadding: 10,
         adaptativeNodeSpotlightRadius: true,
         minSpotlightRadius: 6,
         maxSpotlightRadius: 12,
         openMenuEvents: 'cxttapstart taphold',
         itemColor: 'white',
         itemTextShadowColor: 'black',
         zIndex: 9999,
         atMouse: false,
         outsideMenuCancel: false,
     };
     
     const cy = globalThis._cytoscape({
         container: cyElem,
         elements: [
             ...getCyElements(ns)
         ],
         style: [
             {
             selector: 'node',
                 style: {
                     'background-color': 'data(_background)',
                     'border-color': 'data(_border)',
                     'border-width': '2px',
                     'border-style': 'solid',
                     'label': 'data(id)',
                     'font-weight': 'bolder',
                     'color': 'data(_foreground)',
                     'text-outline-color': 'black',
                 }
             },
 
             {
             selector: 'edge',
                 style: {
                     'width': 1,
                     'line-color': 'lime',
                     'target-arrow-color': 'lime',
                     'target-arrow-shape': "none",
                     'curve-style': 'bezier'
                 }
             }
         ],
         layout: layoutOptions,
         zoomingEnabled: true,
         maxZoom: 5,
         minZoom: 0.05,
         wheelSensitivity: 0.3,
     })
 
     console.log("xt menu", cy.cxtmenu)
 
     cy.cxtmenu(cxtMenuOptions)
 
     cy.on('click', 'node', function(evt){
         goToServer(this)
     });
 
     MAIN_CY = cy
 }