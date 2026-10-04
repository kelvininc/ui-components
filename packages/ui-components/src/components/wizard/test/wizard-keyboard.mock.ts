export const WIZARD_ENTER_OWNERS = [
	{ name: 'native button', html: '<button id="owner">Save connection</button>' },
	{ name: 'input button', html: '<input id="owner" type="button" value="Save connection" />' },
	{ name: 'input submit', html: '<input id="owner" type="submit" value="Save connection" />' },
	{ name: 'input reset', html: '<input id="owner" type="reset" value="Reset connection" />' },
	{ name: 'input image', html: '<input id="owner" type="image" alt="Save connection" />' },
	{ name: 'summary', html: '<details><summary id="owner">Connection details</summary><p>Broker settings</p></details>' },
	{ name: 'link', html: '<a id="owner" href="#connection-help">Connection help</a>' },
	{ name: 'button role', html: '<div id="owner" role="button" tabindex="0">Save connection</div>' },
	{ name: 'textarea', html: '<textarea id="owner">Connection notes</textarea>' },
	{ name: 'contenteditable', html: '<div id="owner" contenteditable="true">Connection notes</div>' }
] as const;
