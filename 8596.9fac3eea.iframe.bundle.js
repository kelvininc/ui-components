"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[8596],{"../ui-components/dist/esm/kv-tag-alarm.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_tag_alarm:()=>KvTagAlarm});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_tag_alarm_types_2fd2af11_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/tag-alarm.types-2fd2af11.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js"),_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../ui-components/dist/esm/icon.types-4961d5a6.js"),_isEmpty_a0aef625_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../ui-components/dist/esm/isEmpty-a0aef625.js");__webpack_require__("../ui-components/dist/esm/_Map-17f4821f.js"),__webpack_require__("../ui-components/dist/esm/isObject-19644380.js");const ALARM_CONFIG={[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_2__.c.One]:{name:"Critical",icon:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Circle},[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_2__.c.Two]:{name:"Urgent",icon:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Nabla},[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_2__.c.Three]:{name:"Advisory",icon:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Triangle},[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_2__.c.Four]:{name:"Medium",icon:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Square},[_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_2__.c.Five]:{name:"Low",icon:_icon_types_4961d5a6_js__WEBPACK_IMPORTED_MODULE_3__.E.Diamond}},KvTagAlarm=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.severity=void 0,this.size=_tag_alarm_types_2fd2af11_js__WEBPACK_IMPORTED_MODULE_1__.E.Normal,this.hideLabel=!1,this.label=""}render(){const alarmConfig=ALARM_CONFIG[this.severity];return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:{"alarm-tag":!0,[`alarm-tag--severity-${this.severity}`]:!0}},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-tag",null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"alarm-tag-container",slot:"left-slot"},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:{"icon-wrapper":!0,[`icon-wrapper--size-${this.size}`]:!0}},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-icon",{name:alarmConfig.icon})),!this.hideLabel&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"alarm-tag-label"},(0,_isEmpty_a0aef625_js__WEBPACK_IMPORTED_MODULE_4__.i)(this.label)?alarmConfig.name:this.label)))))}};KvTagAlarm.style='@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host .alarm-tag kv-tag{--tag-content-padding:var(--kv-spacing, 4px)}:host .alarm-tag--severity-1 kv-tag{--tag-background-color:rgba(var(--kv-error-dark-rgb, 198, 22, 0), 0.16)}:host .alarm-tag--severity-1 kv-icon{--icon-color:var(--kv-error-dark, #c61600)}:host .alarm-tag--severity-2 kv-tag{--tag-background-color:rgba(var(--kv-warning-dark-rgb, 224, 169, 59), 0.16)}:host .alarm-tag--severity-2 kv-icon{--icon-color:var(--kv-warning-dark, #e0a93b)}:host .alarm-tag--severity-3 kv-tag{--tag-background-color:rgba(var(--kv-secondary-1-dark-rgb, 4, 5, 62), 0.16)}:host .alarm-tag--severity-3 kv-icon{--icon-color:var(--kv-secondary-1-dark, #04053e)}:host .alarm-tag--severity-4 kv-tag{--tag-background-color:rgba(var(--kv-secondary-3-dark-rgb, 48, 89, 96), 0.16)}:host .alarm-tag--severity-4 kv-icon{--icon-color:var(--kv-secondary-3-dark, #305960)}:host .alarm-tag--severity-5 kv-tag{--tag-background-color:rgba(var(--kv-info-dark-rgb, 34, 97, 212), 0.16)}:host .alarm-tag--severity-5 kv-icon{--icon-color:var(--kv-info-dark, #2261d4)}:host .icon-wrapper--size-xxsmall kv-icon{--icon-height:12px;--icon-width:12px}:host .icon-wrapper--size-xsmall kv-icon{--icon-height:16px;--icon-width:16px}:host .icon-wrapper--size-small kv-icon{--icon-height:18px;--icon-width:18px}:host .icon-wrapper--size-normal kv-icon{--icon-height:24px;--icon-width:24px}:host .icon-wrapper--size-large kv-icon{--icon-height:28px;--icon-width:28px}:host .alarm-tag-container{display:flex;flex-direction:row;gap:var(--kv-spacing, 4px);align-items:center}:host .alarm-tag-container .alarm-tag-label{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:14px;font-weight:400;font-stretch:normal;font-style:normal;line-height:21px;letter-spacing:normal;text-transform:none;color:var(--kv-neutral-2, #e5e5e5)}'}}]);