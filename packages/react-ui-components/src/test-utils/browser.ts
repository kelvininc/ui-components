type KelvinElement = HTMLElement & { componentOnReady?: () => Promise<unknown> };

/**
 * Resolves once a Kelvin custom element is defined and has rendered, so its shadow root holds its
 * controls. Call it before reading or focusing anything a component renders.
 */
export const whenKelvinReady = async <E extends KelvinElement>(host: E): Promise<E> => {
	await customElements.whenDefined(host.localName);
	await host.componentOnReady?.();
	return host;
};
