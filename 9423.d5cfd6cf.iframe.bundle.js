"use strict";(self.webpackChunk_kelvininc_react_ui_components=self.webpackChunk_kelvininc_react_ui_components||[]).push([[9423],{"../ui-components/dist/esm/config-605ce3cc.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>DEFAULT_THROTTLE_WAIT});const DEFAULT_THROTTLE_WAIT=300},"../ui-components/dist/esm/kv-radio.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{kv_radio:()=>KvRadio});var _index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/index-a56a3e8b.js"),_config_605ce3cc_js__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__("../ui-components/dist/esm/config-605ce3cc.js"),_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/components-72a05f91.js"),_throttle_0b99525b_js__WEBPACK_IMPORTED_MODULE_11__=(__webpack_require__("../ui-components/dist/esm/lib-config-c46937ad.js"),__webpack_require__("../ui-components/dist/esm/action-button.types-8f833980.js"),__webpack_require__("../ui-components/dist/esm/absolute-time-picker-dropdown.types-e9649833.js"),__webpack_require__("../ui-components/dist/esm/icon.types-4961d5a6.js"),__webpack_require__("../ui-components/dist/esm/summary-card.types-39a67541.js"),__webpack_require__("../ui-components/dist/esm/toaster.types-7f928937.js"),__webpack_require__("../ui-components/dist/esm/tree-item.types-9f0ec4b6.js"),__webpack_require__("../ui-components/dist/esm/tag-alarm.types-2fd2af11.js"),__webpack_require__("../ui-components/dist/esm/wizard.types-dff33869.js"),__webpack_require__("../ui-components/dist/esm/throttle-0b99525b.js"));__webpack_require__("../ui-components/dist/esm/isObject-19644380.js"),__webpack_require__("../ui-components/dist/esm/isSymbol-a7df0fca.js");const KvRadio=class{constructor(hostRef){(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.checkedChange=(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"checkedChange",7),this.onCheck=()=>{this.isChecked=!0,this.checkedChange.emit(this.isChecked)},this.checked=!1,this.disabled=!1,this.label="",this.size=_components_72a05f91_js__WEBPACK_IMPORTED_MODULE_1__.a.Large,this.isChecked=this.checked,this.isDisabled=this.disabled}checkedChangeHandler(newValue){this.isChecked=newValue}disabledChangeHandler(newValue){this.isDisabled=newValue}handleKeyDown(ev){"Space"===ev.code&&this.onCheck()}connectedCallback(){this.clickThrottler=(0,_throttle_0b99525b_js__WEBPACK_IMPORTED_MODULE_11__.t)((()=>this.onCheck()),_config_605ce3cc_js__WEBPACK_IMPORTED_MODULE_14__.D)}render(){return(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)(_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.H,null,(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:{"radio-container":!0,[`radio-container--size-${this.size}`]:!0,checked:this.isChecked,disabled:this.isDisabled},onClick:this.clickThrottler},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{tabIndex:this.isChecked||this.isDisabled?-1:0,class:"circle"},(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("div",{class:"checked-icon"})),this.label&&(0,_index_a56a3e8b_js__WEBPACK_IMPORTED_MODULE_0__.h)("span",{class:"label"},this.label)))}static get watchers(){return{checked:["checkedChangeHandler"],disabled:["disabledChangeHandler"]}}};KvRadio.style={light:'@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--input-height-large:36px;--input-height-small:28px}.radio-container{display:flex;align-items:center;cursor:pointer;user-select:none;width:fit-content}.radio-container--size-large{height:var(--input-height-large)}.radio-container--size-small{height:var(--input-height-small)}.radio-container.disabled{pointer-events:none;opacity:0.5}.radio-container.disabled .circle{border-color:var(--radio-input-default-color)}.circle{height:14px;width:14px;border-radius:50%;border:1px solid var(--radio-input-default-color);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}.circle:focus{outline:none;border-color:var(--radio-input-focused-color)}.circle .checked-icon{height:8px;width:8px;border-radius:50%;transition:all 0.2s ease-out}.checked .circle{border:1px solid var(--radio-input-checked-color)}.checked .circle .checked-icon{height:8px;width:8px;border-radius:50%;background:var(--radio-input-checked-color);transition:all 0.2s ease-out}.label{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:14px;font-weight:400;font-stretch:normal;font-style:normal;line-height:21px;letter-spacing:normal;text-transform:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--radio-label-text-color);margin-left:var(--kv-spacing-2x, 8px)}:host{--radio-label-text-color:var(--kv-text, #fff);--radio-input-checked-color:var(--kv-primary, #005cc7);--radio-input-focused-color:var(--kv-primary, #005cc7);--radio-input-default-color:var(--kv-neutral-3, #ddd)}',night:'@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}@property --rotation{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes rotate-border{to{--rotation:360deg}}:host{--input-height-large:36px;--input-height-small:28px}.radio-container{display:flex;align-items:center;cursor:pointer;user-select:none;width:fit-content}.radio-container--size-large{height:var(--input-height-large)}.radio-container--size-small{height:var(--input-height-small)}.radio-container.disabled{pointer-events:none;opacity:0.5}.radio-container.disabled .circle{border-color:var(--radio-input-default-color)}.circle{height:14px;width:14px;border-radius:50%;border:1px solid var(--radio-input-default-color);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}.circle:focus{outline:none;border-color:var(--radio-input-focused-color)}.circle .checked-icon{height:8px;width:8px;border-radius:50%;transition:all 0.2s ease-out}.checked .circle{border:1px solid var(--radio-input-checked-color)}.checked .circle .checked-icon{height:8px;width:8px;border-radius:50%;background:var(--radio-input-checked-color);transition:all 0.2s ease-out}.label{font-family:var(--kv-primary-font, "proxima-nova", sans-serif, "Arial");font-size:14px;font-weight:400;font-stretch:normal;font-style:normal;line-height:21px;letter-spacing:normal;text-transform:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--radio-label-text-color);margin-left:var(--kv-spacing-2x, 8px)}:host{--radio-label-text-color:var(--kv-neutral-2, #e5e5e5);--radio-input-checked-color:var(--kv-neutral-0, #fff);--radio-input-focused-color:var(--kv-neutral-5, #707070);--radio-input-default-color:var(--kv-neutral-0, #fff)}'}},"../ui-components/dist/esm/throttle-0b99525b.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{d:()=>debounce,t:()=>throttle});var _isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../ui-components/dist/esm/isObject-19644380.js"),_isSymbol_a7df0fca_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../ui-components/dist/esm/isSymbol-a7df0fca.js"),reWhitespace=/\s/;var reTrimStart=/^\s+/;function baseTrim(string){return string?string.slice(0,function trimmedEndIndex(string){for(var index=string.length;index--&&reWhitespace.test(string.charAt(index)););return index}(string)+1).replace(reTrimStart,""):string}var NAN=NaN,reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;function toNumber(value){if("number"==typeof value)return value;if((0,_isSymbol_a7df0fca_js__WEBPACK_IMPORTED_MODULE_1__.i)(value))return NAN;if((0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(value)){var other="function"==typeof value.valueOf?value.valueOf():value;value=(0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=baseTrim(value);var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NAN:+value}var now=function(){return _isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.r.Date.now()},FUNC_ERROR_TEXT$1="Expected a function",nativeMax=Math.max,nativeMin=Math.min;function debounce(func,wait,options){var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime=0,leading=!1,maxing=!1,trailing=!0;if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT$1);function invokeFunc(time){var args=lastArgs,thisArg=lastThis;return lastArgs=lastThis=void 0,lastInvokeTime=time,result=func.apply(thisArg,args)}function shouldInvoke(time){var timeSinceLastCall=time-lastCallTime;return void 0===lastCallTime||timeSinceLastCall>=wait||timeSinceLastCall<0||maxing&&time-lastInvokeTime>=maxWait}function timerExpired(){var time=now();if(shouldInvoke(time))return trailingEdge(time);timerId=setTimeout(timerExpired,function remainingWait(time){var timeWaiting=wait-(time-lastCallTime);return maxing?nativeMin(timeWaiting,maxWait-(time-lastInvokeTime)):timeWaiting}(time))}function trailingEdge(time){return timerId=void 0,trailing&&lastArgs?invokeFunc(time):(lastArgs=lastThis=void 0,result)}function debounced(){var time=now(),isInvoking=shouldInvoke(time);if(lastArgs=arguments,lastThis=this,lastCallTime=time,isInvoking){if(void 0===timerId)return function leadingEdge(time){return lastInvokeTime=time,timerId=setTimeout(timerExpired,wait),leading?invokeFunc(time):result}(lastCallTime);if(maxing)return clearTimeout(timerId),timerId=setTimeout(timerExpired,wait),invokeFunc(lastCallTime)}return void 0===timerId&&(timerId=setTimeout(timerExpired,wait)),result}return wait=toNumber(wait)||0,(0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(options)&&(leading=!!options.leading,maxWait=(maxing="maxWait"in options)?nativeMax(toNumber(options.maxWait)||0,wait):maxWait,trailing="trailing"in options?!!options.trailing:trailing),debounced.cancel=function cancel(){void 0!==timerId&&clearTimeout(timerId),lastInvokeTime=0,lastArgs=lastCallTime=lastThis=timerId=void 0},debounced.flush=function flush(){return void 0===timerId?result:trailingEdge(now())},debounced}var FUNC_ERROR_TEXT="Expected a function";function throttle(func,wait,options){var leading=!0,trailing=!0;if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT);return(0,_isObject_19644380_js__WEBPACK_IMPORTED_MODULE_0__.i)(options)&&(leading="leading"in options?!!options.leading:leading,trailing="trailing"in options?!!options.trailing:trailing),debounce(func,wait,{leading,maxWait:wait,trailing})}}}]);