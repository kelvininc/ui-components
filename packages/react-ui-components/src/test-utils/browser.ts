type KelvinElement = HTMLElement & { componentOnReady?: () => Promise<unknown> };

const READY_TIMEOUT_MS = 5000;

/**
 * Resolves once a Kelvin custom element is defined and has rendered, so its shadow root holds its
 * controls. Call it before reading or focusing anything a component renders. It rejects, naming
 * the element, if that takes longer than `timeoutMs`: usually a misspelled tag, or core wasn't built.
 */
export const whenKelvinReady = async <E extends KelvinElement>(host: E, timeoutMs = READY_TIMEOUT_MS): Promise<E> => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_resolve, reject) => {
		timer = setTimeout(
			() => reject(new Error(`<${host.localName}> wasn't defined and rendered within ${timeoutMs}ms. Check the tag, and run pnpm build:packages.`)),
			timeoutMs
		);
	});
	const ready = (async () => {
		await customElements.whenDefined(host.localName);
		await host.componentOnReady?.();
	})();

	try {
		await Promise.race([ready, timeout]);
		return host;
	} finally {
		clearTimeout(timer);
	}
};
