import { newSpecPage } from '@stencil/core/testing';
import { ActionButton } from './action-button';

describe('action-button', () => {
	it('renders', async () => {
		const { root } = await newSpecPage({
			components: [ActionButton],
			html: '<action-button></action-button>',
		});
		expect(root).toEqualHtml(`
      <action-button>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </action-button>
    `);
	});

	it('renders with values', async () => {
		const { root } = await newSpecPage({
			components: [ActionButton],
			html: `<action-button first="Stencil" last="'Don't call me a framework' JS"></action-button>`,
		});
		expect(root).toEqualHtml(`
      <action-button first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </action-button>
    `);
	});
});
