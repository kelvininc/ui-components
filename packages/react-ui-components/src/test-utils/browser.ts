type KelvinElement = HTMLElement & { componentOnReady?: () => Promise<unknown> };

const READY_TIMEOUT_MS = 5000;

/**
 * Resolves once a Kelvin custom element is defined and has rendered, so its shadow root holds its
 * controls. Call it before reading or focusing anything a component renders. It rejects, naming
 * the element, if that takes longer than `timeoutMs`. `null` is accepted so a `querySelector`
 * result can go straight in; it rejects with a clear message.
 */
export const whenKelvinReady = async <E extends KelvinElement>(host: E | null, timeoutMs = READY_TIMEOUT_MS): Promise<E> => {
	if (host === null) {
		throw new Error('The query for the element matched nothing');
	}

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

/** Waits for current and newly rendered Kelvin hosts in `container`'s light DOM within one deadline. */
export const whenAllKelvinReady = async <C extends ParentNode>(container: C, timeoutMs = READY_TIMEOUT_MS): Promise<C> => {
	const ready = new Set<HTMLElement>();
	const deadline = Date.now() + timeoutMs;
	for (;;) {
		const hosts = Array.from(container.querySelectorAll<HTMLElement>('*')).filter(element => element.localName.startsWith('kv-') && !ready.has(element));
		if (!hosts.length) return container;
		const remaining = deadline - Date.now();
		if (remaining <= 0) throw new Error(`<${hosts[0].localName}> appeared after the container's ${timeoutMs}ms readiness deadline`);
		await Promise.all(hosts.map(host => whenKelvinReady(host, remaining)));
		hosts.forEach(host => ready.add(host));
		// A Stencil render can add light-DOM children, such as an action menu's trigger.
	}
};
