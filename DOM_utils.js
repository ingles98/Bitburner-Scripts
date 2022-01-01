/**
 * Just a few DOM helper methods to... You know, help out with the DOM and stuff.
 */

/**
 * Makes an element draggable by its header.
 * The element should have an ID and a child element to portray as the HEADER which should also have an id (MAIN_ELEMENT.id + "_header")
 * Using "root" element in Bitburner's (v1.2.0) DOM to calculate boundaries.
 */
 export function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const rootElement = document.getElementById("root")
    if (document.getElementById(elmnt.id + "_header")) {
      document.getElementById(elmnt.id + "_header").onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      const elemntWidth = elmnt.offsetWidth
      const elemntHeight = elmnt.offsetHeight
      const posX = Math.min(Math.max((elmnt.offsetLeft - pos1), 0), rootElement.offsetWidth - elemntWidth +16)
      const posY = Math.min(Math.max((elmnt.offsetTop - pos2), 0), Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - elemntHeight)
      
      elmnt.style.top = posY + "px";
      elmnt.style.left = posX + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  
  /**
   * Returns a DOM element from an HTML string.
   */
  export function elementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
  }