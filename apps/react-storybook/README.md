# @kelvininc/react-storybook

This is a React Storybook application for the Kelvin UI Components library. It provides a development environment for building, testing, and documenting UI components.

## Table of Contents

-   [Installation](#installation)
-   [Scripts](#scripts)
-   [Dependencies](#dependencies)
-   [Development](#development)
-   [Building](#building)
-   [Linting](#linting)
-   [License](#license)

## Installation

To install the dependencies, run:

```sh
pnpm install
```

## Scripts

Here are the available scripts for this project:

-   `pnpm clean`: Cleans the node_modules directory.
-   `pnpm clean:build`: Removes the storybook-static directory.
-   `pnpm clean:modules`: Removes the node_modules directory.
-   `pnpm dev`: Starts the Storybook development server on port 6006.
-   `pnpm prebuild`: Cleans the build directory before building.
-   `pnpm build`: Builds the Storybook application.
-   `pnpm lint`: Runs the linter.
-   `pnpm lint:check`: Checks for linting errors.
-   `pnpm lint:fix`: Fixes linting errors.
-   `pnpm eslint:check`: Runs ESLint with caching and quiet mode.
-   `pnpm eslint:lint`: Runs ESLint with caching, quiet mode, and auto-fix.
-   `pnpm postinstall`: Runs a custom script to copy icons after installation.

## Development

To start the Storybook development server, run:

```sh
pnpm dev
```

This will start the server on port 6006.

## Building

To build the Storybook application, run:

```sh
pnpm build
```

This will create a static version of your Storybook in the `storybook-static` directory.

## Linting

To check for linting errors, run:

```sh
pnpm lint:check
```

To fix linting errors, run:

```sh
pnpm lint:fix
```

## License

This project is licensed under the MIT License.
