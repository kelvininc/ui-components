"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[279],{"../ui-components/dist/esm/config-605ce3cc.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>DEFAULT_THROTTLE_WAIT});const DEFAULT_THROTTLE_WAIT=300},"../ui-components/dist/esm/kv-toggle-button.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_toggle_button:()=>KvToggleButton});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_config_605ce3cc_js__WEBPACK_IMPORTED_MODULE_17__=__webpack_require__("../ui-components/dist/esm/config-605ce3cc.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js"),_throttle_0b99525b_js__WEBPACK_IMPORTED_MODULE_11__=(__webpack_require__("../ui-components/dist/esm/lib-config-c46937ad.js"),__webpack_require__("../ui-components/dist/esm/action-button.types-8f833980.js"),__webpack_require__("../ui-components/dist/esm/absolute-time-picker-dropdown.types-e9649833.js"),__webpack_require__("../ui-components/dist/esm/icon.types-7d5ed2e4.js"),__webpack_require__("../ui-components/dist/esm/summary-card.types-39a67541.js"),__webpack_require__("../ui-components/dist/esm/toaster.types-2d0edfe4.js"),__webpack_require__("../ui-components/dist/esm/tree-item.types-9f0ec4b6.js"),__webpack_require__("../ui-components/dist/esm/tag-alarm.types-2fd2af11.js"),__webpack_require__("../ui-components/dist/esm/wizard.types-dff33869.js"),__webpack_require__("../ui-components/dist/esm/throttle-0b99525b.js")),_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("../ui-components/dist/esm/isEmpty-e5b2e43e.js");__webpack_require__("../ui-components/dist/esm/isObject-19644380.js"),__webpack_require__("../ui-components/dist/esm/isSymbol-a7df0fca.js"),__webpack_require__("../ui-components/dist/esm/_Set-24fc9b25.js"),__webpack_require__("../ui-components/dist/esm/_Map-17f4821f.js");const KvToggleButton=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.checkedChange=(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"checkedChange",7),this.onCheck=()=>{this.disabled||this.checkedChange.emit(this.value)},this.onClick=event=>{this.preventDefault&&event.preventDefault(),this.clickThrottler(event)},this.value=void 0,this.label=void 0,this.icon=void 0,this.size=_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Small,this.disabled=!1,this.checked=!1,this.preventDefault=!1,this.withRadio=!1}connectedCallback(){this.clickThrottler=(0,_throttle_0b99525b_js__WEBPACK_IMPORTED_MODULE_11__.t)((()=>this.onCheck()),_config_605ce3cc_js__WEBPACK_IMPORTED_MODULE_17__.D)}render(){const hasLabel=!(0,_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_12__.i)(this.label),hasIcon=!(0,_isEmpty_e5b2e43e_js__WEBPACK_IMPORTED_MODULE_12__.i)(this.icon);return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:{"toggle-button":!0,"toggle-button--checked":this.checked,"toggle-button--disabled":this.disabled,"toggle-button--only-icon":hasIcon&&!hasLabel,[`toggle-button--size-${this.size}`]:!0},part:"toggle-button",onClick:this.onClick},this.withRadio&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-radio",{checked:this.checked}),hasIcon&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"toggle-button-icon",part:"toggle-icon"},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("kv-icon",{name:this.icon})),hasLabel&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"toggle-button-label",part:"toggle-label"},this.label)))}};KvToggleButton.style='@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--button-height-large:36px;--button-height-small:28px;--button-padding-large:var(--kv-spacing-2x, 8px) var(--kv-spacing-4x, 16px);--button-padding-small:var(--kv-spacing, 4px) var(--kv-spacing-3x, 12px);--button-icon-height-large:24px;--button-icon-height-small:16px;--button-icon-width-large:24px;--button-icon-width-small:16px;--text-color-default:var(--kv-neutral-2, #e5e5e5);--text-color-active:var(--kv-neutral-0, #fff);--text-color-disabled:var(--kv-neutral-5, #707070);--background-color-default:var(--kv-neutral-6, #3f3f3f);--background-color-active:var(--kv-neutral-6, #3f3f3f);--background-color-disabled:var(--kv-neutral-7, #2a2a2a);--border-color-default:var(--kv-neutral-6, #3f3f3f);--border-color-active:var(--kv-neutral-0, #fff);--border-color-disabled:var(--kv-neutral-6, #3f3f3f);--border-radius-top-left:2px;--border-radius-bottom-left:2px;--border-radius-top-right:2px;--border-radius-bottom-right:2px}.toggle-button{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:14px;font-weight:400;font-stretch:normal;font-style:normal;line-height:21px;letter-spacing:normal;text-transform:none;position:relative;user-select:none;text-decoration:none;cursor:pointer;box-sizing:border-box;display:inline-flex;align-items:center;gap:var(--kv-spacing-2x, 8px);border-top-left-radius:var(--border-radius-top-left);border-bottom-left-radius:var(--border-radius-bottom-left);border-top-right-radius:var(--border-radius-top-right);border-bottom-right-radius:var(--border-radius-bottom-right);border:1px solid var(--border-color-default);background:var(--background-color-default);color:var(--text-color-default);height:var(--button-height-large);padding:var(--button-padding-large)}.toggle-button .toggle-button-icon kv-icon{--icon-color:var(--text-color-default);--icon-width:16px;--icon-height:16px;width:16px;height:16px}.toggle-button--checked{border:1px solid var(--border-color-active);background:var(--background-color-active);color:var(--text-color-active)}.toggle-button--checked .toggle-button-icon kv-icon{--icon-color:var(--text-color-active)}.toggle-button--disabled{cursor:not-allowed;pointer-events:none;border:1px solid var(--border-color-disabled);background:var(--background-color-disabled);color:var(--text-color-disabled)}.toggle-button--disabled .toggle-button-icon kv-icon{--icon-color:var(--text-color-disabled)}.toggle-button--size-small{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:12px;font-weight:400;font-stretch:normal;font-style:normal;line-height:18px;letter-spacing:normal;text-transform:none;padding:var(--button-padding-small);height:var(--button-height-small)}.toggle-button--size-small.toggle-button--only-icon{width:var(--button-height-small);justify-content:center}.toggle-button--size-small.toggle-button--only-icon .toggle-button-icon kv-icon{--icon-width:var(--button-icon-width-small);--icon-height:var(--button-icon-height-small);width:var(--button-icon-width-small);height:var(--button-icon-height-small)}.toggle-button--only-icon{padding:var(--kv-spacing, 4px);width:var(--button-height-large)}.toggle-button--only-icon .toggle-button-icon kv-icon{--icon-width:var(--button-icon-width-large);--icon-height:var(--button-icon-height-large);width:var(--button-icon-width-large);height:var(--button-icon-height-large)}'},"../ui-components/dist/esm/throttle-0b99525b.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{d:()=>debounce,t:()=>throttle});var _isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/isObject-19644380.js"),_isSymbol_a7df0fca_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/isSymbol-a7df0fca.js"),reWhitespace=/\s/;var reTrimStart=/^\s+/;function baseTrim(string){return string?string.slice(0,function trimmedEndIndex(string){for(var index=string.length;index--&&reWhitespace.test(string.charAt(index)););return index}(string)+1).replace(reTrimStart,""):string}var NAN=NaN,reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;function toNumber(value){if("number"==typeof value)return value;if((0,_isSymbol_a7df0fca_js__WEBPACK_IMPORTED_MODULE_1__.i)(value))return NAN;if((0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(value)){var other="function"==typeof value.valueOf?value.valueOf():value;value=(0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=baseTrim(value);var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NAN:+value}var now=function(){return _isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.r.Date.now()},FUNC_ERROR_TEXT$1="Expected a function",nativeMax=Math.max,nativeMin=Math.min;function debounce(func,wait,options){var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime=0,leading=!1,maxing=!1,trailing=!0;if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT$1);function invokeFunc(time){var args=lastArgs,thisArg=lastThis;return lastArgs=lastThis=void 0,lastInvokeTime=time,result=func.apply(thisArg,args)}function shouldInvoke(time){var timeSinceLastCall=time-lastCallTime;return void 0===lastCallTime||timeSinceLastCall>=wait||timeSinceLastCall<0||maxing&&time-lastInvokeTime>=maxWait}function timerExpired(){var time=now();if(shouldInvoke(time))return trailingEdge(time);timerId=setTimeout(timerExpired,function remainingWait(time){var timeWaiting=wait-(time-lastCallTime);return maxing?nativeMin(timeWaiting,maxWait-(time-lastInvokeTime)):timeWaiting}(time))}function trailingEdge(time){return timerId=void 0,trailing&&lastArgs?invokeFunc(time):(lastArgs=lastThis=void 0,result)}function debounced(){var time=now(),isInvoking=shouldInvoke(time);if(lastArgs=arguments,lastThis=this,lastCallTime=time,isInvoking){if(void 0===timerId)return function leadingEdge(time){return lastInvokeTime=time,timerId=setTimeout(timerExpired,wait),leading?invokeFunc(time):result}(lastCallTime);if(maxing)return clearTimeout(timerId),timerId=setTimeout(timerExpired,wait),invokeFunc(lastCallTime)}return void 0===timerId&&(timerId=setTimeout(timerExpired,wait)),result}return wait=toNumber(wait)||0,(0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(options)&&(leading=!!options.leading,maxWait=(maxing="maxWait"in options)?nativeMax(toNumber(options.maxWait)||0,wait):maxWait,trailing="trailing"in options?!!options.trailing:trailing),debounced.cancel=function cancel(){void 0!==timerId&&clearTimeout(timerId),lastInvokeTime=0,lastArgs=lastCallTime=lastThis=timerId=void 0},debounced.flush=function flush(){return void 0===timerId?result:trailingEdge(now())},debounced}var FUNC_ERROR_TEXT="Expected a function";function throttle(func,wait,options){var leading=!0,trailing=!0;if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT);return(0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(options)&&(leading="leading"in options?!!options.leading:leading,trailing="trailing"in options?!!options.trailing:trailing),debounce(func,wait,{leading,maxWait:wait,trailing})}}}]);