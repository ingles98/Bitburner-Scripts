# Network Mapping tool


Automatically scans and maps the entire network PLUS interaction with servers (connect to, get running processes, get information, manual backdoor...).

Using Cytoscape.js to create the diagram in the DOM. There is an ESM build that should work out of the box.
Also using Cytoscape-CxtMenu (Contextual menu extension), however this one is tricky to implement due to be built targetting UMD and seemingly not being
properly imported. Had to build my own version targetting "window" (on Webpack) with the `library.name = "cytoscapeCxtmenu" `.

## How it works:
- At the start, this script will search for all neighbours from "home" and check those neighbour's neighbours themselves recursively.
- An array with all found "Nodes" (Servers really) and another array with NodeConnections (relations) are used to not only store this information
but also make sure we dont bubble back from a neighbour to a previously already computed Node.
- This search shouldn't take long and the DOM is created with an interactive diagram.

There is a lot of little things that I will want to have implemented like hiding/showing the map window, getting the color scheme from the game itself,
and possibly better way to display certain useful gameplay information through the node's aspect.

Currently a node can have:
- Either a Green or Red body, represeting whether a node has been backdoored or not.
- Green or Red border, representing whether you have root access or not.
- Yellow text whether you're currently connected to that node.


## Dependencies
- cytoscape.js
- cytoscape-cxtmenu

## Remarks
The diagram automatically updates every dozens of milliseconds to get servers information for a more interactive experience.
If for some reason it lags while using the Netmap you might want to consider looking into the timings or whether you need it to keep refreshing.

Currently this script is in very early stages and a lot of optimizations can probably be done.