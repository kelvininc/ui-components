# Kelvin UI Components

Kelvin UI Components provides a set of reusable, high quality framework-agnostic UI components, this means you can use them with the current most popular Front-End Development Frameworks like React, Angular or if you prefer, the components are also available as W3C compliant WebComponents.

This is not just a library of UI components as it's also a style guide where you can see how the component looks and behaves by interacting with it, to showcase this we use [Storybook](https://storybook.js.org/), a free open-source tool.

Our Storybook is publicly available [here](https://kelvininc.github.io/ui-components/)

## Technological Stack
* Development: [StencilJS](https://stenciljs.com/docs/introduction)
* Testing: [Puppeteer](https://pptr.dev/) & [Jest](https://jestjs.io/)
## Getting Started
### Development
To start a Stencil development server, run:

```bash
npm run start
```

### Production
To build the component for production, run:

```bash
npm run build
```

To run the tests for the components, run:

```bash
npm test # or test:watch to watch for changes
```
## Contributing

### Component naming
When creating new components, always use `kv` as the tag prefix for your component (E.g: `<kv-datepicker>`).
### Merge flow
1. Create a branch using `dev` as your source branch
2. Develop the component and write tests for it
3. Check if your code has any linting issues using `npm run lint`
4. Run the tests using `npm run test`
5. Create a pull request pointing to `dev`
