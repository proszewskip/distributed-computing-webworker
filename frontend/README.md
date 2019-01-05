# Distributed Computing WebWorker frontend server

This project serves the administrator dashboard and the distributed node dashboard to users.

It uses [next.js](https://github.com/zeit/next.js/) for building the pages and for server-side
rendering.

## Prerequisites

- Install [node](https://nodejs.org/en/) >= 10.11.0
  - On Linux, [nvm](https://github.com/creationix/nvm) is recommended as an installation tool.
  - Verify that `node --version` prints out a version greater than 10.11.0.
  - Verify that `npm` is installed correctly by running `npm --version`. It should print out a
    version higher than 5.0.0.

## Installation

Install the dependencies using the following command:

```sh
npm install
```

## Development

To run the server in development mode, run the following command:

```sh
npm run dev
```

The server will be available on [http://localhost:3000](http://localhost:3000), although for it to
work properly it needs to be accessed using the proxy created in [the main project's
README](../README.md) ([http://localhost](http://localhost)).

## Component gallery

To view the components used in the project in isolation, run the following command:

```sh
npm run storybook
```

## Testing

Run the following command to run unit tests:

```sh
npm run test
```

## Generating the documentation

Run the following command to generate the documentation for the project:

```sh
npm run generate-docs
```

[The documentation](docs/index.html) will be generated in the `docs` directory.

## Linting

To lint the codebase, run the following command:

```sh
npm run lint
```

This will verify that the code style matches the configured one.
