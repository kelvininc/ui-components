"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[6913],{"../ui-components/dist/esm/kv-toggle-button-group.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_toggle_button_group:()=>KvToggleButtonGroup});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js");__webpack_require__("../ui-components/dist/esm/lib-config-c46937ad.js"),__webpack_require__("../ui-components/dist/esm/action-button.types-8f833980.js"),__webpack_require__("../ui-components/dist/esm/absolute-time-picker-dropdown.types-e9649833.js"),__webpack_require__("../ui-components/dist/esm/icon.types-4961d5a6.js"),__webpack_require__("../ui-components/dist/esm/summary-card.types-39a67541.js"),__webpack_require__("../ui-components/dist/esm/toaster.types-7f928937.js"),__webpack_require__("../ui-components/dist/esm/tree-item.types-9f0ec4b6.js"),__webpack_require__("../ui-components/dist/esm/tag-alarm.types-2fd2af11.js"),__webpack_require__("../ui-components/dist/esm/wizard.types-dff33869.js");const KvToggleButtonGroup=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.checkedChange=(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"checkedChange",7),this.buttons=[],this.withRadio=!1,this.disabled=!1,this.size=_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Small,this.selectedButtons={},this.disabledButtons={},this.radioButtons={}}render(){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,this.buttons.map((button=>{var _a,_b,_c,_d,_e,_f;return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-toggle-button",{part:"toggle-button-container",exportparts:"toggle-button",value:button.value,label:button.label,icon:button.icon,preventDefault:button.preventDefault,size:null!==(_a=this.size)&&void 0!==_a?_a:button.size,disabled:null!==(_c=null!==(_b=this.disabled)&&void 0!==_b?_b:this.disabledButtons[button.value])&&void 0!==_c?_c:button.disabled,checked:null!==(_d=this.selectedButtons[button.value])&&void 0!==_d?_d:button.checked,withRadio:null!==(_f=null!==(_e=this.withRadio)&&void 0!==_e?_e:this.radioButtons[button.value])&&void 0!==_f?_f:button.withRadio})})))}};KvToggleButtonGroup.style='@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host>kv-toggle-button{margin-right:var(--kv-spacing, 4px)}:host>kv-toggle-button:last-child{margin-right:unset}'}}]);