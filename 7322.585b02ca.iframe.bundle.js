"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[7322],{"../ui-components/dist/esm/kv-tree.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_tree:()=>KvTree});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/get-f6dcdc12.js");__webpack_require__("../ui-components/dist/esm/_Map-17f4821f.js"),__webpack_require__("../ui-components/dist/esm/isObject-19644380.js"),__webpack_require__("../ui-components/dist/esm/isSymbol-a7df0fca.js"),__webpack_require__("../ui-components/dist/esm/_MapCache-23611695.js");const KvTree=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.nodeToggleExpand=(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"nodeToggleExpand",7),this.nodeClick=(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"nodeClick",7),this.onItemClick=item=>this.nodeClick.emit(item),this.onToggleExpand=item=>this.nodeToggleExpand.emit(item),this.nodes=void 0,this.loading=!1,this.selectedNode=void 0,this.hiddenNodes=void 0,this.expandedNodes=void 0,this.spotlightedNodes=void 0,this.disabledNodes=void 0,this.highlightedNodes=void 0,this.loadingNodes=void 0,this.labelsSize=void 0,this.expandIcon=void 0,this.showTooltip=void 0,this.tooltipDelay=void 0}drawNodes(nodes){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.F,null,nodes.map((item=>{var _a;return!(0,_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__.g)(this.hiddenNodes,[item.id],!1)&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-tree-item",{slot:"child-slot",label:item.label,additionalLabel:item.additionalLabel,placeholder:item.placeholder,labelsSize:this.labelsSize,icon:item.icon,iconState:item.iconState,counter:item.counter,counterState:item.counterState,hasChildren:item.lazyLoadChildren,selected:this.selectedNode===item.id,expanded:(0,_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__.g)(this.expandedNodes,[item.id],!1),disabled:(0,_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__.g)(this.disabledNodes,[item.id],!1),preventDefault:item.preventDefault,highlighted:(0,_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__.g)(this.highlightedNodes,[item.id],!1),spotlighted:(0,_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__.g)(this.spotlightedNodes,[item.id],!1),expandIcon:this.expandIcon,loading:this.loading||(0,_get_f6dcdc12_js__WEBPACK_IMPORTED_MODULE_1__.g)(this.loadingNodes,[item.id],!1),onItemClick:_=>this.onItemClick(item),onToggleExpand:_=>this.onToggleExpand(item),showTooltip:this.showTooltip,tooltipDelay:this.tooltipDelay,part:"tree-item",exportparts:"icon,children"},(null===(_a=item.children)||void 0===_a?void 0:_a.length)>0&&this.drawNodes(item.children))})))}render(){var _a;return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"container",part:"tree"},(null===(_a=this.nodes)||void 0===_a?void 0:_a.length)>0&&this.drawNodes(this.nodes)))}};KvTree.style={light:'@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--tree-node-width:300px;--tree-node-height:40px;--tree-node-gap:var(--kv-spacing-2x, 8px);--tree-children-offset:var(--kv-spacing-3x, 12px);--tree-children-padding-left:var(--kv-spacing-2x, 8px)}:host .container{width:var(--tree-node-width)}:host kv-tree-item{--node-width:var(--tree-node-width);--node-height:var(--tree-node-height);--node-gap:var(--tree-node-gap);--children-offset:var(--tree-children-offset);--children-padding-left:var(--tree-children-padding-left)}:host>kv-tree-item:not(:first-child)::before{content:"";display:block;height:var(--tree-node-gap)}:host{--tree-connector-lines-color:var(--kv-primary, #005cc7)}:host kv-tree-item{--connector-lines-color:var(--tree-connector-lines-color)}',night:'@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--tree-node-width:300px;--tree-node-height:40px;--tree-node-gap:var(--kv-spacing-2x, 8px);--tree-children-offset:var(--kv-spacing-3x, 12px);--tree-children-padding-left:var(--kv-spacing-2x, 8px)}:host .container{width:var(--tree-node-width)}:host kv-tree-item{--node-width:var(--tree-node-width);--node-height:var(--tree-node-height);--node-gap:var(--tree-node-gap);--children-offset:var(--tree-children-offset);--children-padding-left:var(--tree-children-padding-left)}:host>kv-tree-item:not(:first-child)::before{content:"";display:block;height:var(--tree-node-gap)}:host{--tree-connector-lines-color:var(--kv-neutral-5, #707070)}:host kv-tree-item{--connector-lines-color:var(--tree-connector-lines-color)}'}}}]);