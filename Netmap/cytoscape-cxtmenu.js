/**
 * This is a custom build targetting webpack library.target as "window" due to issues concerning importing UMD onto Bitburner.
 * 
 * Original repository: https://github.com/cytoscape/cytoscape.js-cxtmenu
 * Original Source-code version: (v3.4.0) https://github.com/cytoscape/cytoscape.js-cxtmenu/tree/3bc397d0f7522d148e4c803ad4217aa2401c7ab1
 */

/**
 * cytoscape.js-cxtmenu's License:

 * Copyright (c) 2016-2021, The Cytoscape Consortium.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

var t={849:t=>{t.exports=null!=Object.assign?Object.assign.bind(Object):function(t,...e){return e.filter((t=>null!=t)).forEach((e=>{Object.keys(e).forEach((i=>t[i]=e[i]))})),t}},991:(t,e,i)=>{const n=i(930),a=i(849),{removeEles:o,setStyles:l,createElement:d,getPixelRatio:s,getOffset:r}=i(17);t.exports=function(t){let e,i,c,h=a({},n,t),u=this,p=u.container(),g={options:h,handlers:[],container:d({class:"cxtmenu"})},m=g.container,f=d(),x=d({tag:"canvas"}),P=[],b=x.getContext("2d"),v=100,y=2*(v+h.activePadding);function S(t,e){T.drawBg=[t,e]}function M(t,e){b.globalCompositeOperation="source-over",b.clearRect(0,0,y,y),b.fillStyle=h.fillColor;let i=2*Math.PI/P.length,n=Math.PI/2,a=n+i;for(let e=0;e<P.length;e++){let o=P[e];o.fillColor&&(b.fillStyle=o.fillColor),b.beginPath(),b.moveTo(t+h.activePadding,t+h.activePadding),b.arc(t+h.activePadding,t+h.activePadding,t,2*Math.PI-n,2*Math.PI-a,!0),b.closePath(),b.fill(),n+=i,a+=i,b.fillStyle=h.fillColor}b.globalCompositeOperation="destination-out",b.strokeStyle="white",b.lineWidth=h.separatorWidth,n=Math.PI/2,a=n+i;for(let e=0;e<P.length;e++){let e=t*Math.cos(n),o=t*Math.sin(n);b.beginPath(),b.moveTo(t+h.activePadding,t+h.activePadding),b.lineTo(t+h.activePadding+e,t+h.activePadding-o),b.closePath(),b.stroke(),n+=i,a+=i}b.fillStyle="white",b.globalCompositeOperation="destination-out",b.beginPath(),b.arc(t+h.activePadding,t+h.activePadding,e+h.spotlightPadding,0,2*Math.PI,!0),b.closePath(),b.fill(),b.globalCompositeOperation="source-over"}function w(t,e,n,a,o){let l=2*Math.PI/P.length,d=Math.PI/2,s=d+l;d+=l*i,s+=l*i,b.fillStyle=h.activeFillColor,b.strokeStyle="black",b.lineWidth=1,b.beginPath(),b.moveTo(n+h.activePadding,n+h.activePadding),b.arc(n+h.activePadding,n+h.activePadding,n+h.activePadding,2*Math.PI-d,2*Math.PI-s,!0),b.closePath(),b.fill(),b.fillStyle="white",b.globalCompositeOperation="destination-out";let r=n+h.activePadding+t/n*(o+h.spotlightPadding-h.indicatorSize/4),c=n+h.activePadding+e/n*(o+h.spotlightPadding-h.indicatorSize/4),u=Math.PI/4-a;b.translate(r,c),b.rotate(u);let p=h.indicatorSize>o+h.spotlightPadding?o+h.spotlightPadding:h.indicatorSize;b.beginPath(),b.fillRect(-p/2,-p/2,p,p),b.closePath(),b.fill(),b.rotate(-u),b.translate(-r,-c),b.beginPath(),b.arc(n+h.activePadding,n+h.activePadding,o+h.spotlightPadding,0,2*Math.PI,!0),b.closePath(),b.fill(),b.globalCompositeOperation="source-over"}function C(){let t=s(),e=y,i=y;x.width=e*t,x.height=i*t,x.style.width=e+"px",x.style.height=i+"px",b.setTransform(1,0,0,1,0,0),b.scale(t,t)}p.insertBefore(m,p.firstChild),m.appendChild(f),f.appendChild(x),l(m,{position:"absolute",zIndex:h.zIndex,userSelect:"none",pointerEvents:"none"}),["mousedown","mousemove","mouseup","contextmenu"].forEach((t=>{m.addEventListener(t,(t=>(t.preventDefault(),!1)))})),l(f,{display:"none",width:y+"px",height:y+"px",position:"absolute",zIndex:1,marginLeft:-h.activePadding+"px",marginTop:-h.activePadding+"px",userSelect:"none"}),x.width=y,x.height=y;let R,E,I,O=!0,T={},F=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||(t=>setTimeout(t,16)),z=function(){T.drawBg&&M.apply(null,T.drawBg),T.drawCommands&&w.apply(null,T.drawCommands),T={},O&&F(z)};C(),z();let N={on:function(t,e,i){let n=i;return"core"===e&&(n=function(t){if(t.cyTarget===u||t.target===u)return i.apply(this,[t])}),g.handlers.push({events:t,selector:e,fn:n}),"core"===e?u.on(t,n):u.on(t,e,n),this}};return function(){let t,n,a,s,g,m,x=!1,b=function(){t&&e.grabify(),a&&u.userZoomingEnabled(!0),s&&u.userPanningEnabled(!0),g&&u.boxSelectionEnabled(!0)};window.addEventListener("resize",C),N.on("resize",(function(){C()})).on(h.openMenuEvents,h.selector,(function(n){e=this;let M=this,w=this===u;if(x&&(f.style.display="none",x=!1,b()),"function"==typeof h.commands){const t=h.commands(e);t.then?t.then((t=>{P=t,I()})):(P=t,I())}else P=h.commands,I();function I(){if(!P||0===P.length)return;let b,I,O,T;a=u.userZoomingEnabled(),u.userZoomingEnabled(!1),s=u.userPanningEnabled(),u.userPanningEnabled(!1),g=u.boxSelectionEnabled(),u.boxSelectionEnabled(!1),t=e.grabbable&&e.grabbable(),t&&e.ungrabify(),!w&&M&&M.isNode instanceof Function&&M.isNode()&&!M.isParent()&&!h.atMouse?(b=M.renderedPosition(),I=M.renderedOuterWidth(),O=M.renderedOuterHeight(),T=I/2,T=!h.adaptativeNodeSpotlightRadius&&h.minSpotlightRadius?Math.max(T,h.minSpotlightRadius):T,T=!h.adaptativeNodeSpotlightRadius&&h.maxSpotlightRadius?Math.min(T,h.maxSpotlightRadius):T):(b=n.renderedPosition||n.cyRenderedPosition,I=1,O=1,T=I/2,T=h.minSpotlightRadius?Math.max(T,h.minSpotlightRadius):T,T=h.maxSpotlightRadius?Math.min(T,h.maxSpotlightRadius):T),c=r(p),R=b.x,E=b.y,v=I/2+(h.menuRadius instanceof Function?h.menuRadius(e):Number(h.menuRadius)),y=2*(v+h.activePadding),C(),l(f,{width:y+"px",height:y+"px",display:"block",left:b.x-v+"px",top:b.y-v+"px"}),function(t,e){o(".cxtmenu-item",f);let i=2*Math.PI/P.length,n=Math.PI/2,a=n+i;for(let o=0;o<P.length;o++){let s=P[o],r=(n+a)/2,c=(t+e)/2*Math.cos(r),u=(t+e)/2*Math.sin(r),p=1*Math.abs((t-e)*Math.cos(r)),g=1*Math.abs((t-e)*Math.sin(r));p=Math.max(p,g);let m=d({class:"cxtmenu-item"});l(m,{color:h.itemColor,cursor:"default",display:"table","text-align":"center",position:"absolute","text-shadow":"-1px -1px 2px "+h.itemTextShadowColor+", 1px -1px 2px "+h.itemTextShadowColor+", -1px 1px 2px "+h.itemTextShadowColor+", 1px 1px 1px "+h.itemTextShadowColor,left:"50%",top:"50%","min-height":p+"px",width:p+"px",height:p+"px",marginLeft:c-p/2+"px",marginTop:-u-p/2+"px"});let x=d({class:"cxtmenu-content"});s.content instanceof HTMLElement?x.appendChild(s.content):x.innerHTML=s.content,l(x,{width:p+"px",height:p+"px","vertical-align":"middle",display:"table-cell"}),l(x,s.contentStyle||{}),!0!==s.disabled&&!1!==s.enabled||x.setAttribute("class","cxtmenu-content cxtmenu-disabled"),f.appendChild(m),m.appendChild(x),n+=i,a+=i}}(v,T),S(v,T),i=void 0,x=!0,m=n}})).on("cxtdrag tapdrag",h.selector,n=function(t){if(!x)return;t.preventDefault();let n=t.originalEvent,a=n.touches&&n.touches.length>0,o=(a?n.touches[0].pageX:n.pageX)-window.pageXOffset,l=(a?n.touches[0].pageY:n.pageY)-window.pageYOffset;i=void 0;let d=o-c.left-R,s=l-c.top-E;0===d&&(d=.01);let r,u=Math.sqrt(d*d+s*s),p=(s*s-u*u-d*d)/(-2*u*d),g=Math.acos(p);if(e&&e.isNode instanceof Function&&e.isNode()&&!e.isParent()&&!h.atMouse?(r=e.renderedOuterWidth(),I=r/2,I=!h.adaptativeNodeSpotlightRadius&&h.minSpotlightRadius?Math.max(I,h.minSpotlightRadius):I,I=!h.adaptativeNodeSpotlightRadius&&h.maxSpotlightRadius?Math.min(I,h.maxSpotlightRadius):I):(r=1,I=r/2,I=h.minSpotlightRadius?Math.max(I,h.minSpotlightRadius):I,I=h.maxSpotlightRadius?Math.min(I,h.maxSpotlightRadius):I),v=r/2+(h.menuRadius instanceof Function?h.menuRadius(e):Number(h.menuRadius)),u<I+h.spotlightPadding||"number"==typeof h.outsideMenuCancel&&u>v+h.activePadding+h.outsideMenuCancel)return void S(v,I);S(v,I);let m=d*v/u,f=s*v/u;s>0&&(g=Math.PI+Math.abs(g-Math.PI));let b=2*Math.PI/P.length,y=Math.PI/2,M=y+b;for(let t=0;t<P.length;t++){let e=P[t],n=y<=g&&g<=M||y<=g+2*Math.PI&&g+2*Math.PI<=M;if(!0!==e.disabled&&!1!==e.enabled||(n=!1),n){i=t;break}y+=b,M+=b}!function(t,e,i,n,a){T.drawCommands=[t,e,i,n,a]}(m,f,v,g,I)}).on("tapdrag",n).on("cxttapend tapend",(function(){if(f.style.display="none",void 0!==i){let t=P[i].select;t&&(t.apply(e,[e,m]),i=void 0)}x=!1,b()}))}(),{destroy:function(){O=!1,function(){let t=g.handlers;for(let e=0;e<t.length;e++){let i=t[e];"core"===i.selector?u.off(i.events,i.fn):u.off(i.events,i.selector,i.fn)}window.removeEventListener("resize",C)}(),m.remove()}}}},930:t=>{t.exports={menuRadius:function(t){return 100},selector:"node",commands:[],fillColor:"rgba(0, 0, 0, 0.75)",activeFillColor:"rgba(1, 105, 217, 0.75)",activePadding:20,indicatorSize:24,separatorWidth:3,spotlightPadding:4,adaptativeNodeSpotlightRadius:!1,minSpotlightRadius:24,maxSpotlightRadius:38,openMenuEvents:"cxttapstart taphold",itemColor:"white",itemTextShadowColor:"transparent",zIndex:9999,atMouse:!1,outsideMenuCancel:!1}},17:t=>{const e=function(t,e){let i=Object.keys(e);for(let n=0,a=i.length;n<a;n++)t.style[i[n]]=e[i[n]]};t.exports={removeEles:function(t,e=document){let i=e.querySelectorAll(t);for(let t=0;t<i.length;t++){let e=i[t];e.parentNode.removeChild(e)}},setStyles:e,createElement:function(t){t=t||{};let i=document.createElement(t.tag||"div");return i.className=t.class||"",t.style&&e(i,t.style),i},getPixelRatio:function(){return window.devicePixelRatio||1},getOffset:function(t){let e=t.getBoundingClientRect();return{left:e.left+document.body.scrollLeft+parseFloat(getComputedStyle(document.body)["padding-left"])+parseFloat(getComputedStyle(document.body)["border-left-width"]),top:e.top+document.body.scrollTop+parseFloat(getComputedStyle(document.body)["padding-top"])+parseFloat(getComputedStyle(document.body)["border-top-width"])}}}},138:(t,e,i)=>{const n=i(991);let a=function(t){t&&t("core","cxtmenu",n)};"undefined"!=typeof cytoscape&&a(cytoscape),t.exports=a}},e={},i=function i(n){var a=e[n];if(void 0!==a)return a.exports;var o=e[n]={exports:{}};return t[n](o,o.exports,i),o.exports}(138);window.cytoscapeCxtmenu=i;