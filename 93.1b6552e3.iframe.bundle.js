"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[93],{"../ui-components/dist/esm/kv-info-label.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_info_label:()=>KvInfoLabel});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_commonjsHelpers_5ec8f9b7_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/_commonjsHelpers-5ec8f9b7.js"),_clipboard_helper_2081356c_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../ui-components/dist/esm/clipboard.helper-2081356c.js"),_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../ui-components/dist/esm/icon.types-4961d5a6.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js"),_isEmpty_a0aef625_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("../ui-components/dist/esm/isEmpty-a0aef625.js"),ResizeSensor=(__webpack_require__("../ui-components/dist/esm/_Map-17f4821f.js"),__webpack_require__("../ui-components/dist/esm/isObject-19644380.js"),(0,_commonjsHelpers_5ec8f9b7_js__WEBPACK_IMPORTED_MODULE_1__.c)((function(module,exports){"undefined"!=typeof window?window:_commonjsHelpers_5ec8f9b7_js__WEBPACK_IMPORTED_MODULE_1__.a,module.exports=function(){if("undefined"==typeof window)return null;var globalWindow="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),requestAnimationFrame=globalWindow.requestAnimationFrame||globalWindow.mozRequestAnimationFrame||globalWindow.webkitRequestAnimationFrame||function(fn){return globalWindow.setTimeout(fn,20)},cancelAnimationFrame=globalWindow.cancelAnimationFrame||globalWindow.mozCancelAnimationFrame||globalWindow.webkitCancelAnimationFrame||function(timer){globalWindow.clearTimeout(timer)};function forEachElement(elements,callback){var elementsType=Object.prototype.toString.call(elements),isCollectionTyped="[object Array]"===elementsType||"[object NodeList]"===elementsType||"[object HTMLCollection]"===elementsType||"[object Object]"===elementsType||"undefined"!=typeof jQuery&&elements instanceof jQuery||"undefined"!=typeof Elements&&elements instanceof Elements,i=0,j=elements.length;if(isCollectionTyped)for(;i<j;i++)callback(elements[i]);else callback(elements)}function getElementSize(element){if(!element.getBoundingClientRect)return{width:element.offsetWidth,height:element.offsetHeight};var rect=element.getBoundingClientRect();return{width:Math.round(rect.width),height:Math.round(rect.height)}}function setStyle(element,style){Object.keys(style).forEach((function(key){element.style[key]=style[key]}))}var ResizeSensor=function(element,callback){var lastAnimationFrameForInvisibleCheck=0;function EventQueue(){var i,j,q=[];this.add=function(ev){q.push(ev)},this.call=function(sizeInfo){for(i=0,j=q.length;i<j;i++)q[i].call(this,sizeInfo)},this.remove=function(ev){var newQueue=[];for(i=0,j=q.length;i<j;i++)q[i]!==ev&&newQueue.push(q[i]);q=newQueue},this.length=function(){return q.length}}function attachResizeEvent(element,resized){if(element)if(element.resizedAttached)element.resizedAttached.add(resized);else{element.resizedAttached=new EventQueue,element.resizedAttached.add(resized),element.resizeSensor=document.createElement("div"),element.resizeSensor.dir="ltr",element.resizeSensor.className="resize-sensor";var style={pointerEvents:"none",position:"absolute",left:"0px",top:"0px",right:"0px",bottom:"0px",overflow:"hidden",zIndex:"-1",visibility:"hidden",maxWidth:"100%"},styleChild={position:"absolute",left:"0px",top:"0px",transition:"0s"};setStyle(element.resizeSensor,style);var expand=document.createElement("div");expand.className="resize-sensor-expand",setStyle(expand,style);var expandChild=document.createElement("div");setStyle(expandChild,styleChild),expand.appendChild(expandChild);var shrink=document.createElement("div");shrink.className="resize-sensor-shrink",setStyle(shrink,style);var shrinkChild=document.createElement("div");setStyle(shrinkChild,styleChild),setStyle(shrinkChild,{width:"200%",height:"200%"}),shrink.appendChild(shrinkChild),element.resizeSensor.appendChild(expand),element.resizeSensor.appendChild(shrink),element.appendChild(element.resizeSensor);var computedStyle=window.getComputedStyle(element),position=computedStyle?computedStyle.getPropertyValue("position"):null;"absolute"!==position&&"relative"!==position&&"fixed"!==position&&"sticky"!==position&&(element.style.position="relative");var dirty=!1,rafId=0,size=getElementSize(element),lastWidth=0,lastHeight=0,initialHiddenCheck=!0;lastAnimationFrameForInvisibleCheck=0;var resetExpandShrink=function(){var width=element.offsetWidth,height=element.offsetHeight;expandChild.style.width=width+10+"px",expandChild.style.height=height+10+"px",expand.scrollLeft=width+10,expand.scrollTop=height+10,shrink.scrollLeft=width+10,shrink.scrollTop=height+10},reset=function(){if(initialHiddenCheck){if(0===element.offsetWidth&&0===element.offsetHeight)return void(lastAnimationFrameForInvisibleCheck||(lastAnimationFrameForInvisibleCheck=requestAnimationFrame((function(){lastAnimationFrameForInvisibleCheck=0,reset()}))));initialHiddenCheck=!1}resetExpandShrink()};element.resizeSensor.resetSensor=reset;var onResized=function(){rafId=0,dirty&&(lastWidth=size.width,lastHeight=size.height,element.resizedAttached&&element.resizedAttached.call(size))},onScroll=function(){size=getElementSize(element),(dirty=size.width!==lastWidth||size.height!==lastHeight)&&!rafId&&(rafId=requestAnimationFrame(onResized)),reset()},addEvent=function(el,name,cb){el.attachEvent?el.attachEvent("on"+name,cb):el.addEventListener(name,cb)};addEvent(expand,"scroll",onScroll),addEvent(shrink,"scroll",onScroll),lastAnimationFrameForInvisibleCheck=requestAnimationFrame((function(){lastAnimationFrameForInvisibleCheck=0,reset()}))}}forEachElement(element,(function(elem){attachResizeEvent(elem,callback)})),this.detach=function(ev){lastAnimationFrameForInvisibleCheck||(cancelAnimationFrame(lastAnimationFrameForInvisibleCheck),lastAnimationFrameForInvisibleCheck=0),ResizeSensor.detach(element,ev)},this.reset=function(){element.resizeSensor.resetSensor()}};if(ResizeSensor.reset=function(element){forEachElement(element,(function(elem){elem.resizeSensor.resetSensor()}))},ResizeSensor.detach=function(element,ev){forEachElement(element,(function(elem){elem&&(elem.resizedAttached&&"function"==typeof ev&&(elem.resizedAttached.remove(ev),elem.resizedAttached.length())||elem.resizeSensor&&(elem.contains(elem.resizeSensor)&&elem.removeChild(elem.resizeSensor),delete elem.resizeSensor,delete elem.resizedAttached))}))},"undefined"!=typeof MutationObserver){var observer=new MutationObserver((function(mutations){for(var i in mutations)if(mutations.hasOwnProperty(i))for(var items=mutations[i].addedNodes,j=0;j<items.length;j++)items[j].resizeSensor&&ResizeSensor.reset(items[j])}));document.addEventListener("DOMContentLoaded",(function(event){observer.observe(document.body,{childList:!0,subtree:!0})}))}return ResizeSensor}()}))),ElementQueries=(0,_commonjsHelpers_5ec8f9b7_js__WEBPACK_IMPORTED_MODULE_1__.c)((function(module,exports){"undefined"!=typeof window?window:_commonjsHelpers_5ec8f9b7_js__WEBPACK_IMPORTED_MODULE_1__.a,module.exports=function(ResizeSensor){var ElementQueries=function(){var cssStyleElement,allQueries={},idToSelectorMapping=[];function getEmSize(element){element||(element=document.documentElement);var fontSize=window.getComputedStyle(element,null).fontSize;return parseFloat(fontSize)||16}function getElementSize(element){if(!element.getBoundingClientRect)return{width:element.offsetWidth,height:element.offsetHeight};var rect=element.getBoundingClientRect();return{width:Math.round(rect.width),height:Math.round(rect.height)}}function convertToPx(element,value){var numbers=value.split(/\d/),units=numbers[numbers.length-1];switch(value=parseFloat(value),units){case"px":default:return value;case"em":return value*getEmSize(element);case"rem":return value*getEmSize();case"vw":return value*document.documentElement.clientWidth/100;case"vh":return value*document.documentElement.clientHeight/100;case"vmin":case"vmax":var vw=document.documentElement.clientWidth/100,vh=document.documentElement.clientHeight/100;return value*(0,Math["vmin"===units?"min":"max"])(vw,vh)}}function SetupInformation(element,id){var key,option,elementSize,value,actualValue,attrValues,attrValue,attrName;this.element=element;var attributes=["min-width","min-height","max-width","max-height"];this.call=function(){for(key in elementSize=getElementSize(this.element),attrValues={},allQueries[id])allQueries[id].hasOwnProperty(key)&&(option=allQueries[id][key],value=convertToPx(this.element,option.value),actualValue="width"===option.property?elementSize.width:elementSize.height,attrName=option.mode+"-"+option.property,attrValue="","min"===option.mode&&actualValue>=value&&(attrValue+=option.value),"max"===option.mode&&actualValue<=value&&(attrValue+=option.value),attrValues[attrName]||(attrValues[attrName]=""),attrValue&&-1===(" "+attrValues[attrName]+" ").indexOf(" "+attrValue+" ")&&(attrValues[attrName]+=" "+attrValue));for(var k in attributes)attributes.hasOwnProperty(k)&&(attrValues[attributes[k]]?this.element.setAttribute(attributes[k],attrValues[attributes[k]].substr(1)):this.element.removeAttribute(attributes[k]))}}function setupElement(element,id){element.elementQueriesSetupInformation||(element.elementQueriesSetupInformation=new SetupInformation(element,id)),element.elementQueriesSensor||(element.elementQueriesSensor=new ResizeSensor(element,(function(){element.elementQueriesSetupInformation.call()})))}function queueQuery(selector,mode,property,value){if(void 0===allQueries[selector]){allQueries[selector]=[];var id=idToSelectorMapping.length;cssStyleElement.innerHTML+="\n"+selector+" {animation: 0.1s element-queries;}",cssStyleElement.innerHTML+="\n"+selector+" > .resize-sensor {min-width: "+id+"px;}",idToSelectorMapping.push(selector)}allQueries[selector].push({mode,property,value})}function getQuery(container){var query;if(document.querySelectorAll&&(query=container?container.querySelectorAll.bind(container):document.querySelectorAll.bind(document)),query||"undefined"==typeof $$||(query=$$),query||"undefined"==typeof jQuery||(query=jQuery),!query)throw"No document.querySelectorAll, jQuery or Mootools's $$ found.";return query}function findElementQueriesElements(container){var query=getQuery(container);for(var selector in allQueries)if(allQueries.hasOwnProperty(selector))for(var elements=query(selector,container),i=0,j=elements.length;i<j;i++)setupElement(elements[i],selector)}function attachResponsiveImage(element){var children=[],rules=[],sources=[],defaultImageId=0,lastActiveImage=-1,loadedImages=[];for(var i in element.children)if(element.children.hasOwnProperty(i)&&element.children[i].tagName&&"img"===element.children[i].tagName.toLowerCase()){children.push(element.children[i]);var minWidth=element.children[i].getAttribute("min-width")||element.children[i].getAttribute("data-min-width"),src=element.children[i].getAttribute("data-src")||element.children[i].getAttribute("url");sources.push(src);var rule={minWidth};rules.push(rule),minWidth?element.children[i].style.display="none":(defaultImageId=children.length-1,element.children[i].style.display="block")}function check(){var i,imageToDisplay=!1;for(i in children)children.hasOwnProperty(i)&&rules[i].minWidth&&element.offsetWidth>rules[i].minWidth&&(imageToDisplay=i);if(imageToDisplay||(imageToDisplay=defaultImageId),lastActiveImage!==imageToDisplay)if(loadedImages[imageToDisplay])children[lastActiveImage].style.display="none",children[imageToDisplay].style.display="block",lastActiveImage=imageToDisplay;else{var image=new Image;image.onload=function(){children[imageToDisplay].src=sources[imageToDisplay],children[lastActiveImage].style.display="none",children[imageToDisplay].style.display="block",loadedImages[imageToDisplay]=!0,lastActiveImage=imageToDisplay},image.src=sources[imageToDisplay]}else children[imageToDisplay].src=sources[imageToDisplay]}lastActiveImage=defaultImageId,element.resizeSensorInstance=new ResizeSensor(element,check),check()}function findResponsiveImages(){for(var elements=getQuery()("[data-responsive-image],[responsive-image]"),i=0,j=elements.length;i<j;i++)attachResponsiveImage(elements[i])}var regex=/,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/gim,attrRegex=/\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/gim;function extractQuery(css){var match,smatch,attrs,attrMatch;for(css=css.replace(/'/g,'"');null!==(match=regex.exec(css));)for(smatch=match[1]+match[3],attrs=match[2];null!==(attrMatch=attrRegex.exec(attrs));)queueQuery(smatch,attrMatch[1],attrMatch[2],attrMatch[3])}function readRules(rules){var selector="";if(rules)if("string"==typeof rules)-1===(rules=rules.toLowerCase()).indexOf("min-width")&&-1===rules.indexOf("max-width")||extractQuery(rules);else for(var i=0,j=rules.length;i<j;i++)1===rules[i].type?-1!==(selector=rules[i].selectorText||rules[i].cssText).indexOf("min-height")||-1!==selector.indexOf("max-height")?extractQuery(selector):-1===selector.indexOf("min-width")&&-1===selector.indexOf("max-width")||extractQuery(selector):4===rules[i].type?readRules(rules[i].cssRules||rules[i].rules):3===rules[i].type&&rules[i].styleSheet.hasOwnProperty("cssRules")&&readRules(rules[i].styleSheet.cssRules)}var defaultCssInjected=!1;this.init=function(){var animationStart="animationstart";void 0!==document.documentElement.style.webkitAnimationName?animationStart="webkitAnimationStart":void 0!==document.documentElement.style.MozAnimationName?animationStart="mozanimationstart":void 0!==document.documentElement.style.OAnimationName&&(animationStart="oanimationstart"),document.body.addEventListener(animationStart,(function(e){var element=e.target,styles=element&&window.getComputedStyle(element,null),animationName=styles&&styles.getPropertyValue("animation-name");if(animationName&&-1!==animationName.indexOf("element-queries")){element.elementQueriesSensor=new ResizeSensor(element,(function(){element.elementQueriesSetupInformation&&element.elementQueriesSetupInformation.call()}));var id=window.getComputedStyle(element.resizeSensor,null).getPropertyValue("min-width");id=parseInt(id.replace("px","")),setupElement(e.target,idToSelectorMapping[id])}})),defaultCssInjected||((cssStyleElement=document.createElement("style")).type="text/css",cssStyleElement.innerHTML="[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img {width: 100%;}",cssStyleElement.innerHTML+="\n@keyframes element-queries { 0% { visibility: inherit; } }",document.getElementsByTagName("head")[0].appendChild(cssStyleElement),defaultCssInjected=!0);for(var i=0,j=document.styleSheets.length;i<j;i++)try{document.styleSheets[i].href&&0===document.styleSheets[i].href.indexOf("file://")&&console.warn("CssElementQueries: unable to parse local css files, "+document.styleSheets[i].href),readRules(document.styleSheets[i].cssRules||document.styleSheets[i].rules||document.styleSheets[i].cssText)}catch(e){}findResponsiveImages()},this.findElementQueriesElements=function(container){findElementQueriesElements(container)},this.update=function(){this.init()}};ElementQueries.update=function(){ElementQueries.instance.update()},ElementQueries.detach=function(element){element.elementQueriesSetupInformation?(element.elementQueriesSensor.detach(),delete element.elementQueriesSetupInformation,delete element.elementQueriesSensor):element.resizeSensorInstance&&(element.resizeSensorInstance.detach(),delete element.resizeSensorInstance)},ElementQueries.init=function(){ElementQueries.instance||(ElementQueries.instance=new ElementQueries),ElementQueries.instance.init()};var domLoaded=function(callback){if(document.addEventListener)document.addEventListener("DOMContentLoaded",callback,!1);else if(/KHTML|WebKit|iCab/i.test(navigator.userAgent))var DOMLoadTimer=setInterval((function(){/loaded|complete/i.test(document.readyState)&&(callback(),clearInterval(DOMLoadTimer))}),10);else window.onload=callback};return ElementQueries.findElementQueriesElements=function(container){ElementQueries.instance.findElementQueriesElements(container)},ElementQueries.listen=function(){domLoaded(ElementQueries.init)},ElementQueries}(ResizeSensor)})),cssElementQueries={ResizeSensor,ElementQueries};const COPY_TOOLTIP={label:"Copy",resultLabel:"Copied!",position:_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_4__.b.Top},KvInfoLabel=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.tooltipConfig=COPY_TOOLTIP,this.resizeSensor=null,this.onShowMoreToggle=()=>{if(this.showMore=!this.showMore,this.showMore){const textElementHeight=this.descriptionContainer.clientHeight;this.currentDescriptionHeight=textElementHeight}else this.currentDescriptionHeight=this.descriptionHeight},this.onClickCopyAction=async()=>{const tooltipText=this.el.shadowRoot.querySelector("kv-tooltip").shadowRoot.querySelector("#tooltip");await(0,_clipboard_helper_2081356c_js__WEBPACK_IMPORTED_MODULE_2__.a)(this.copyValue)?tooltipText.innerText=this.tooltipConfig.resultLabel:console.error("Copy to clipboard failed")},this.enableShowMoreButton=!1,this.showMore=!1,this.currentDescriptionHeight=null,this.labelTitle=void 0,this.description=void 0,this.descriptionHeight=void 0,this.descriptionCollapsedText="Read more",this.descriptionOpenedText="Read less",this.copyValue=void 0}get showMoreButtonLabel(){return this.showMore?this.descriptionOpenedText:this.descriptionCollapsedText}loadDescriptionHeight(){if(void 0!==this.descriptionHeight){const descriptionHeight=this.descriptionContainer.clientHeight;this.enableShowMoreButton=void 0!==descriptionHeight&&descriptionHeight>this.descriptionHeight}else this.enableShowMoreButton=!1;this.showMore=!!this.enableShowMoreButton&&this.showMore,this.currentDescriptionHeight=this.enableShowMoreButton&&!this.showMore?this.descriptionHeight:null}componentDidRender(){this.descriptionContainer=this.el.shadowRoot.querySelector(".description"),this.descriptionHeight>0&&(this.resizeSensor=new cssElementQueries.ResizeSensor(this.descriptionContainer,(()=>{this.loadDescriptionHeight()})))}disconnectedCallback(){var _a,_b;null===(_a=this.resizeSensor)||void 0===_a||_a.reset(),null===(_b=this.resizeSensor)||void 0===_b||_b.detach(),this.resizeSensor=null}render(){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"info-label"},this.labelTitle&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{part:"title",class:{title:!0,"no-description":(0,_isEmpty_a0aef625_js__WEBPACK_IMPORTED_MODULE_5__.i)(this.description)}},this.labelTitle),this.description&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{style:{height:`${this.currentDescriptionHeight}px`},class:"description-wrapper"},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"description"},this.description&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"text"},this.description),this.copyValue&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-tooltip",{text:this.tooltipConfig.label,position:this.tooltipConfig.position},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-icon",{class:"copy-icon",name:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Copy,onClick:this.onClickCopyAction})),(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("slot",null))),this.enableShowMoreButton&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:{"expand-description-button":!0,expanded:this.showMore},onClick:this.onShowMoreToggle},this.showMoreButtonLabel,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-icon",{name:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Expand}))))}get el(){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.g)(this)}};KvInfoLabel.style={light:'@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--text-color-title:var(--kv-neutral-4, #bebebe);--text-color-description:var(--kv-neutral-2, #e5e5e5);--expanded-button-color:var(--kv-neutral-0, #fff)}.info-label{display:flex;flex-direction:column}.info-label .title{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:12px;font-weight:400;font-stretch:normal;font-style:normal;line-height:18px;letter-spacing:normal;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-color-title);white-space:nowrap;margin-bottom:var(--kv-spacing-2x, 8px)}.info-label .title.no-description{margin-bottom:0}.info-label .description-wrapper{overflow-y:hidden;transition:height 0.3s ease-in-out;height:auto}.info-label .description-wrapper .text{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:14px;font-weight:400;font-stretch:normal;font-style:normal;line-height:21px;letter-spacing:normal;text-transform:none;color:var(--text-color-description)}.info-label .expand-description-button{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:12px;font-weight:400;font-stretch:normal;font-style:normal;line-height:18px;letter-spacing:normal;text-transform:none;display:flex;align-items:center;cursor:pointer;margin-top:var(--kv-spacing-3x, 12px);color:var(--expanded-button-color)}.info-label .expand-description-button kv-icon{--icon-color:var(--expanded-button-color);margin-left:var(--kv-spacing, 4px);transition:transform 0.3s ease-in-out}.info-label .expand-description-button.expanded kv-icon{--icon-rotation:180deg}.description{display:flex;align-items:center}.description .copy-icon{opacity:0}.description:hover .copy-icon{opacity:1;transition:all 200ms ease-in-out}.copy-icon{margin-left:var(--kv-spacing-2x, 8px);cursor:pointer;user-select:none}:host{--text-color-title:var(--kv-neutral-5, #707070);--text-color-description:var(--kv-neutral-9, #121212);--expanded-button-color:var(--kv-primary, #005cc7)}',night:'@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--text-color-title:var(--kv-neutral-4, #bebebe);--text-color-description:var(--kv-neutral-2, #e5e5e5);--expanded-button-color:var(--kv-neutral-0, #fff)}.info-label{display:flex;flex-direction:column}.info-label .title{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:12px;font-weight:400;font-stretch:normal;font-style:normal;line-height:18px;letter-spacing:normal;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-color-title);white-space:nowrap;margin-bottom:var(--kv-spacing-2x, 8px)}.info-label .title.no-description{margin-bottom:0}.info-label .description-wrapper{overflow-y:hidden;transition:height 0.3s ease-in-out;height:auto}.info-label .description-wrapper .text{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:14px;font-weight:400;font-stretch:normal;font-style:normal;line-height:21px;letter-spacing:normal;text-transform:none;color:var(--text-color-description)}.info-label .expand-description-button{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:12px;font-weight:400;font-stretch:normal;font-style:normal;line-height:18px;letter-spacing:normal;text-transform:none;display:flex;align-items:center;cursor:pointer;margin-top:var(--kv-spacing-3x, 12px);color:var(--expanded-button-color)}.info-label .expand-description-button kv-icon{--icon-color:var(--expanded-button-color);margin-left:var(--kv-spacing, 4px);transition:transform 0.3s ease-in-out}.info-label .expand-description-button.expanded kv-icon{--icon-rotation:180deg}.description{display:flex;align-items:center}.description .copy-icon{opacity:0}.description:hover .copy-icon{opacity:1;transition:all 200ms ease-in-out}.copy-icon{margin-left:var(--kv-spacing-2x, 8px);cursor:pointer;user-select:none}:host{--text-color-title:var(--kv-neutral-4, #bebebe);--text-color-description:var(--kv-neutral-2, #e5e5e5);--expanded-button-color:var(--kv-neutral-0, #fff)}'}}}]);