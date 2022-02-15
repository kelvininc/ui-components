![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Kelvin UI Components

Kelvin UI Components provides a set of reusable, high quality framework-agnostic UI components, which means you can use them with the current most popular Front-End Development Frameworks like React, Angular or if you prefer the components are also available as W3C compliant WebComponents.

However, this is not just a library of UI components as it's also a style guide where you can see how the component looks and behaves by interacting with it, for this we use [Storybook](https://storybook.js.org/), a free open-source tool.

Our Storybook is publicly available [here]()

## Technological Stack
* Development: [StencilJS](https://stenciljs.com/docs/introduction)
* Testing: [Puppeteer](https://pptr.dev/) & [Jest](https://jestjs.io/)
## Getting Started
### Setup

To start building a new component using Stencil, start by cloning this repo:

```bash
git clone git@github.com:kelvininc/ui-components.git
cd ui-components
```

Install dependencies by running:

```bash
npm install
```

To generate a new component, run:

```bash
npm run generate
```

### Development
To start a stencil development server, run:

```bash
npm run start
```

To start a storybook development server, run:
```bash
npm run start:storybook
```

Or you can run them both simultaneously with:
```bash
npm run dev
```

### Production
To build the component for production, run:

```bash
npm run build # or build:watch to watch for changes
```

To build storybook for production, run:
```bash
npm run build:storybook
```

To run the unit tests for the components, run:

```bash
npm test # or test:watch to watch for changes
```
## Contributing

### Component naming
When creating new component tags, always use `kv` as the prefix for your component (ex: `<kv-datepicker>`).
### Merge flow
1. Create a branch using `dev` as your source branch
2. Develop the component and test it
3. Check if your code has any linting issues using `npm run lint`
4. Run the tests using `npm run test`
5. Create a pull request pointing to `dev`