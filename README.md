# Kelvin UI Components

Kelvin UI Components provides a set of reusable, high quality framework-agnostic UI components, this means you can use with React or if you prefer, the components are also available as W3C compliant WebComponents.

This is not just a library of UI components as it's also a style guide where you can see how the component looks and behaves by interacting with it, to showcase this we use [Storybook](https://storybook.js.org/), a free open-source tool.

Our Storybook is publicly available [here](https://kelvininc.github.io/ui-components/)

## Technological Stack

-   Development: [StencilJS](https://stenciljs.com/docs/introduction)
-   Testing: [Puppeteer](https://pptr.dev/) & [Jest](https://jestjs.io/)

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
