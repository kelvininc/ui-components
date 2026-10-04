type KelvinElement = HTMLElement & { componentOnReady?: () => Promise<unknown> };

const READY_TIMEOUT_MS = 5000;

/**
 * Resolves once a Kelvin custom element is defined and has rendered, so its shadow root holds its
 * controls. Call it before reading or focusing anything a component renders. It rejects, naming
 * the element, if that takes longer than `timeoutMs`.
 */
export const whenKelvinReady = async <E extends KelvinElement>(host: E, timeoutMs = READY_TIMEOUT_MS): Promise<E> => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_resolve, reject) => {
		timer = setTimeout(
			() =>
				reject(
					new Error(
						`<${host.localName}> wasn't defined and rendered within ${timeoutMs}ms. Check that the tag is spelled right, ` +
							'that the element is attached to the document, that the test imports the React proxies (importing them ' +
							'registers the components), and that pnpm build:packages ran.'
					)
				),
			timeoutMs
		);
	});
	const ready = (async () => {
		await customElements.whenDefined(host.localName);
		await host.componentOnReady?.();
	})();
	// If the timeout wins, a later failure here has nobody to report to
	ready.catch((): undefined => undefined);

	try {
		await Promise.race([ready, timeout]);
		return host;
	} finally {
		clearTimeout(timer);
	}
};
