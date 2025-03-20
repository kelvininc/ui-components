"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[6102],{"../ui-components/dist/esm/kv-tab-navigation.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_tab_navigation:()=>KvTabNavigation});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js"),_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_11__=(__webpack_require__("../ui-components/dist/esm/lib-config-c46937ad.js"),__webpack_require__("../ui-components/dist/esm/action-button.types-8f833980.js"),__webpack_require__("../ui-components/dist/esm/absolute-time-picker-dropdown.types-e9649833.js"),__webpack_require__("../ui-components/dist/esm/icon.types-7d5ed2e4.js"),__webpack_require__("../ui-components/dist/esm/summary-card.types-39a67541.js"),__webpack_require__("../ui-components/dist/esm/toaster.types-2d0edfe4.js"),__webpack_require__("../ui-components/dist/esm/tree-item.types-9f0ec4b6.js"),__webpack_require__("../ui-components/dist/esm/tag-alarm.types-2fd2af11.js"),__webpack_require__("../ui-components/dist/esm/wizard.types-dff33869.js"),__webpack_require__("../ui-components/dist/esm/isEmpty-e5b2e43e.js"));__webpack_require__("../ui-components/dist/esm/_Set-24fc9b25.js"),__webpack_require__("../ui-components/dist/esm/_Map-17f4821f.js"),__webpack_require__("../ui-components/dist/esm/isObject-19644380.js");const FONT_DESCRIPTOR_SIZE_MAP={[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Small]:"normal normal 600 12px proxima-nova",[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Large]:"normal normal 600 16px proxima-nova"},calculateTabWidths=(tabs,notifications,size)=>{const measuringCanvas=document.createElement("canvas"),font=FONT_DESCRIPTOR_SIZE_MAP[size],ctx=measuringCanvas.getContext("2d");ctx.font=font;return tabs.reduce(((acc,{tabKey,label,icon},idx)=>{var _a;const previousTab=idx>0?tabs[idx-1]:void 0,leftOffset=previousTab?+acc[previousTab.tabKey].width+ +acc[previousTab.tabKey].left:0,notificationDotWidth=(null===(_a=notifications[tabKey])||void 0===_a?void 0:_a.active)?14:0,iconWidth=icon?20:0,small=size===_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Small?32:0,textWidth=Math.ceil(ctx.measureText(label).width);return acc[tabKey]={left:`${leftOffset}`,width:`${textWidth+48+notificationDotWidth+small+iconWidth}`},acc}),{})},KvTabNavigation=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.tabChange=(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"tabChange",7),this.tabsIndicatorConfig={},this.tabs=[],this.selectedTabKey=void 0,this.notifications={},this.size=_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Large,this.selectedTabIndicatorConfig={left:"0px",width:"0px"}}tabSelectionHandler(event){this.tabChange.emit(event.detail)}tabsChangeHandler(){this.tabsIndicatorConfig=calculateTabWidths(this.tabs,this.notifications,this.size),this.applySelectedTabStyling()}tabSelectionChangeHandler(){(0,_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_11__.i)(this.tabsIndicatorConfig)&&(this.tabsIndicatorConfig=calculateTabWidths(this.tabs,this.notifications,this.size)),this.applySelectedTabStyling()}componentDidLoad(){this.tabsIndicatorConfig=calculateTabWidths(this.tabs,this.notifications,this.size),this.applySelectedTabStyling()}applySelectedTabStyling(){if((0,_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_11__.i)(this.selectedTabKey)||(0,_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_11__.i)(this.tabsIndicatorConfig[this.selectedTabKey]))return;const{left,width}=this.tabsIndicatorConfig[this.selectedTabKey];this.selectedTabIndicatorConfig={left:`${left}px`,width:`${width}px`}}render(){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,this.tabs.map((item=>{var _a,_b;return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-tab-item",{key:item.tabKey,tabKey:item.tabKey,label:item.label,disabled:item.disabled,selected:item.tabKey===this.selectedTabKey,size:this.size,hasNotification:null===(_a=this.notifications[item.tabKey])||void 0===_a?void 0:_a.active,notificationColor:null===(_b=this.notifications[item.tabKey])||void 0===_b?void 0:_b.color,icon:item.icon,exportparts:"icon"})})),(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"selected-tab-indicator",style:this.selectedTabIndicatorConfig}))}static get watchers(){return{tabs:["tabsChangeHandler"],size:["tabsChangeHandler"],notifications:["tabsChangeHandler"],selectedTabKey:["tabSelectionChangeHandler"]}}};KvTabNavigation.style='@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--tab-list-bg-color:"transparent";--tab-list-indicator-color:var(--kv-primary, #005cc7);--tab-list-divider-color:var(--kv-neutral-5, #707070);position:relative;height:34px;width:100%;display:flex;background-color:var(--tab-list-bg-color)}:host::before{content:"";width:100%;position:absolute;bottom:0;border-bottom:1px solid var(--tab-list-divider-color)}:host .selected-tab-indicator{height:2px;position:absolute;bottom:0;transition:all 0.3s ease-out;background:var(--tab-list-indicator-color)}'}}]);