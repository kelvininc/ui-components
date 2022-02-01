import { newE2EPage } from '@stencil/core/testing';

describe('action-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<action-button></action-button>');
    const element = await page.find('action-button');
    expect(element).toHaveClass('hydrated');
  });
});
