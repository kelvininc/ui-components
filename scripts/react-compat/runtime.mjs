import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ModalOverlay, useModal } from '@kelvininc/react-ui-components/client';

/** Exercise a real library hook and component with the selected React dispatcher. */
const Consumer = () => {
	const state = useModal(false);

	return React.createElement(
		'span',
		null,
		state.isOpen ? 'open' : 'closed',
		React.createElement(ModalOverlay, { isOpen: false })
	);
};

assert.equal(
	renderToString(React.createElement(Consumer)),
	'<span>closed</span>'
);
