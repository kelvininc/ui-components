# Kelvin UI Components

Kelvin UI Components provides a set of reusable, high quality framework-agnostic UI components, this means you can use them with the current most popular Front-End Development Frameworks like React, Angular or if you prefer, the components are also available as W3C compliant WebComponents.

This is not just a library of UI components as it's also a style guide where you can see how the component looks and behaves by interacting with it, to showcase this we use [Storybook](https://storybook.js.org/), a free open-source tool.

Our Storybook is publicly available [here](https://kelvininc.github.io/ui-components/)

## Technological Stack
* Development: [StencilJS](https://stenciljs.com/docs/introduction)
* Testing: [Puppeteer](https://pptr.dev/) & [Jest](https://jestjs.io/)
## Getting Started
### Setup

As we are publishing multiple packages adapted to each Framework, we decided to use a monorepo solution to manage our project, so we went with [Lerna](https://lerna.js.org/) as our choice due to it's maturity.

Start by cloning this repo:

```bash
git clone git@github.com:kelvininc/ui-components.git
cd ui-components
```

1. Install the dependencies:
```bash
npm install
```

2. Bootstrap the packages:
```bash
npm run bootstrap
```

3. Build the packages:
```bash
npm run build:packages
```

### Development
To start developing a new component, first you'll need to change directory into the `packages/ui-components` directory.
```bash
cd packages/ui-components
```

To start a Stencil development server, run:

```bash
npm run start
```

### Production
To build the component for production, from the root directory, run:

```bash
npm run build:packages
```

To build storybook for production, from the root directory, run:
```bash
npm run storybook:build
```

To run the tests for the components, change directory into the `packages/ui-components` directory and run:

```bash
npm test # or test.watch to watch for changes
```
## Contributing

### Component naming
When creating new components, always use `kv` as the tag prefix for your component (E.g: `<kv-datepicker>`).
### Merge flow
1. Make sure you're in the right directory, this should be the `ui-components` folder
2. Create a branch using `dev` as your source branch
3. Develop the component and write tests for it
4. Check if your code has any linting issues using `npm run lint`
5. Run the tests using `npm run test`
6. Create a pull request pointing to `dev`
