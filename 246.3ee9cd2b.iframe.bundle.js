"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[246],{"../ui-components/dist/esm/kv-copy-to-clipboard.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_copy_to_clipboard:()=>KvCopyToClipboard});var ECopyToClipboardState,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_floating_ui_dom_esm_2bcd0da6_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/floating-ui.dom.esm-2bcd0da6.js"),_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../ui-components/dist/esm/icon.types-4961d5a6.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js"),_clipboard_helper_2081356c_js__WEBPACK_IMPORTED_MODULE_12__=(__webpack_require__("../ui-components/dist/esm/lib-config-c46937ad.js"),__webpack_require__("../ui-components/dist/esm/action-button.types-8f833980.js"),__webpack_require__("../ui-components/dist/esm/absolute-time-picker-dropdown.types-e9649833.js"),__webpack_require__("../ui-components/dist/esm/summary-card.types-39a67541.js"),__webpack_require__("../ui-components/dist/esm/toaster.types-7f928937.js"),__webpack_require__("../ui-components/dist/esm/tree-item.types-9f0ec4b6.js"),__webpack_require__("../ui-components/dist/esm/tag-alarm.types-2fd2af11.js"),__webpack_require__("../ui-components/dist/esm/wizard.types-dff33869.js"),__webpack_require__("../ui-components/dist/esm/clipboard.helper-2081356c.js"));!function(ECopyToClipboardState){ECopyToClipboardState.ReadyToCopy="ready-to-copy",ECopyToClipboardState.Copied="copied"}(ECopyToClipboardState||(ECopyToClipboardState={}));const ICON_CONFIGS={[ECopyToClipboardState.ReadyToCopy]:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_2__.E.CopyClipboard,[ECopyToClipboardState.Copied]:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_2__.E.Success},DEFAULT_TOOLTIP_CONFIG={placement:_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_3__.b.BottomEnd,middleware:[(0,_floating_ui_dom_esm_2bcd0da6_js__WEBPACK_IMPORTED_MODULE_1__.o)({mainAxis:4,crossAxis:-8})]},KvCopyToClipboard=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.onTextCopy=async ev=>{if(ev.stopPropagation(),this.copyState!==ECopyToClipboardState.Copied)try{await(0,_clipboard_helper_2081356c_js__WEBPACK_IMPORTED_MODULE_12__.a)(this.copiableText),this.copyState=ECopyToClipboardState.Copied,setTimeout((()=>this.copyState=ECopyToClipboardState.ReadyToCopy),2e3)}catch(_a){throw new Error("Unable to copy to clipboard")}},this.copiableText=void 0,this.tooltipSuffix=void 0,this.tooltipDelay=500,this.tooltipConfig=DEFAULT_TOOLTIP_CONFIG,this.copyState=ECopyToClipboardState.ReadyToCopy}get tooltipText(){return state=this.copyState,suffix=this.tooltipSuffix,state===ECopyToClipboardState.Copied?"Copied":`Copy ${suffix||""}`.trim();var state,suffix}render(){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-tooltip",{text:this.tooltipText,options:this.tooltipConfig,delay:this.tooltipDelay,onClick:this.onTextCopy},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{part:"content",class:"copy-to-clipboard-container"},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("slot",null),(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:{"state-icon":!0,"state-icon--success":this.copyState===ECopyToClipboardState.Copied}},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-icon",{name:ICON_CONFIGS[this.copyState],part:"icon"})))))}};KvCopyToClipboard.style='@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--container-width:100%;--container-padding:var(--kv-spacing-2x, 8px);--container-hover-background-color:kv-color("neutral-6");--container-gap:var(--kv-spacing-2x, 8px);--icon-start-opacity:0;--icon-color-default:var(--kv-neutral-2, #e5e5e5);--icon-color-success:var(--kv-success, #05a357);--icon-background-color-success:var(--kv-neutral-0, #fff);--icon-size:16px}.copy-to-clipboard-container{width:var(--container-width);display:flex;justify-content:space-between;align-items:center;border-radius:4px;gap:var(--container-gap);padding:var(--container-padding);box-sizing:border-box;transition:background-color 0.2s ease-in-out, opacity 0.25s ease-in-out}.copy-to-clipboard-container:hover{cursor:pointer;background-color:var(--container-hover-background-color)}.copy-to-clipboard-container:hover .state-icon kv-icon{opacity:1}.copy-to-clipboard-container .state-icon kv-icon{--icon-height:var(--icon-size);--icon-width:var(--icon-size);--icon-color:var(--icon-color-default);opacity:var(--icon-start-opacity)}.copy-to-clipboard-container .state-icon--success kv-icon{--icon-color:var(--icon-color-success);--icon-background-color:var(--icon-background-color-success)}'}}]);