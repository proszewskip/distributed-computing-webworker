# Distributed Computing WebWorker

This project is a system for distributed computing in which the computation happens in the browser
using WebAssembly.

This allows for using any device that supports WebAssembly to participate in the system and take on
tasks.

## Architecture

The project consists of the following components:

1. Database

   [PostgreSQL](https://www.postgresql.org/) has been selected as the database provider.

2. API server

   Handles user authentication, allows for managing tasks, assigns subtasks to nodes.

   [ASP.NET Core 2.2](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-2.2) is used as
   the framework.

3. Administrator dashboard

   A dashboard for managing tasks and viewing the status of the system.

   It is written in [React](https://reactjs.org/).

4. Distributed node dashboard

   A dashboard for clients that connect as distributed nodes.

   Displays node's status, as well as manages the computation.

   It is written in [React](https://reactjs.org/) and uses
   [WebWorkers](https://en.wikipedia.org/wiki/Web_worker) for doing the computation on multiple
   background threads.

5. Frontend server

   A server that delivers both administrator and distributed node dashboards to users.

   [Next.js](https://github.com/zeit/next.js/) is used as the server, as it allows for Server-Side
   rendering React.

6. Reverse proxy

   A reverse proxy in front of the frontend server and the API server.

   Clients connect to the proxy and it forwards their requests internally in the system.

   [nginx](https://www.nginx.com/) is used as the reverse proxy server.

More information regarding the frontend server, as well as the administrator dashboard and the
distributed node dashboard is available in [frontend/README.md](frontend/README.md).

## General prerequisites

The following are needed for both deploying and developing the project:

- Install [docker](https://www.docker.com/get-started)
- Install [docker-compose](https://docs.docker.com/compose/install/)

## Instructions

### Deployment

This project uses docker and docker-compose to containerize all the components of the system.

To build server locally and deploy it on the remote machine, run the following commands in the
main directory of the repository:

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build --no-start
docker save distributed-computing-webworker_backend distributed-computing-webworker_frontend postgres nginx | gzip > docker_images.tar.gz
```

`docker_images.tar.gz`, `docker-compose.yml`, `docker-compose.prod.yml` should now be copied to the deployment server, e.g. using scp.

```sh
scp docker_images.tar.gz docker-compose.yml docker-compose.prod.yml username@production:~
```

After `docker_images.tar.gz, docker-compose.yml, docker-compose.prod.yml` are copied to the deployment server, run the following commands on it:

```sh
gunzip -c ~/docker_images.tar.gz | docker load
rm ~/docker_images.tar.gz
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The project should now be running on the remote machine and it should be accessible on [http://production](http://production).

### Startup

To start the project, run the following command in the main directory of the repository:

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

This will build and download all the required docker images and run containers in a separate docker
network.

After the command completes, the project will be accessible on [http://localhost](http://localhost).

### Shutdown

Run the following command:

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Rebuild images

Keep in mind that running the [Startup](#startup) command again will use the cached images and not
rebuild them. Therefore, any changes made to the source code will not be reflected.

To fix this issue, the images have to be rebuilt. This can happen when starting up the project:

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Development

While developing it is recommended to run only some of the services as docker containers (i.e. the
database and the proxy) and run the API server and the frontend server on the host machine (i.e.
your PC).

### Development prerequisites

- Install [.NET Core 2.2](https://www.microsoft.com/net/download/dotnet-core/2.2)
- Install [nuget](https://docs.microsoft.com/en-us/nuget/install-nuget-client-tools).

#### Linux-specific development prerequisites

- Install latest [mono](https://www.mono-project.com/docs/getting-started/install/).
- Set an enviroment variable with the path to the `mono` compiler
  - `export FrameworkPathOverride=/usr/lib/mono/4.5/`
  - it is recommended to persist this environment variable in the system (e.g. add it to
    `~/.bash_profile` on Ubuntu or the equivalent on other operating systems)

### Post-installation steps

After the installation of the prerequisites, run the following commands to download the dependencies
and set up the database and the proxy:

```sh
# Download dependencies
dotnet restore
nuget restore

# Build the project
dotnet build

# Startup the database and the proxy
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

The proxy will listen on port 80 ([http://localhost](http://localhost)).

The last command will also start a `dockerhost` service that allows the proxy container to access
the services that are ran on the host machine (i.e. the API server and the frontend server).

### Running the API server

To run the API server (located in the `Server` directory), run the following command:

```sh
dotnet run -p Server
```

This will start the server on port 5000.

Take a look at [the frontend server's readme](frontend/README.md) for information on how to run the
frontend server in development mode.

## Generating the documentation

### Backend and library

In order to generate documentation [doxygen](http://www.doxygen.nl/download.html) must be installed.

Run the following command from main project directory to generate the documentation for the project:

```sh
doxygen
```

[The documentation](docs/index.html) will be generated in the `docs` directory.

### API

#### HTML document

Documentation is available under [http://localhost:5000/swagger](http://localhost:5000/swagger)
when the `Server` is running in Debug configuration (when using dotnet run).

#### OpenAPI JSON

In order to generate OpenAPI json file, the `Server` must be built with the following command:

```sh
 dotnet build /p:GenerateSwaggerDocumentation=True
```

After running the mentioned command, `swagger.json` will be generated in Server/docs.

## End-to-end tests

### Setup

To run end-to-end tests, first run the Docker containers in the development environment:

```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Afterwards, build the frontend project:

```sh
cd frontend
npm build
```

### Running the tests

First, run the server with the `ServerE2ETests` launch-profile:

```sh
dotnet -p Server --launch-profile ServerE2ETests
```

Using this launch profile will make sure that the database is pristine upon launch.
Moreover, this will use a separate database, therefore no development data will be lost.

Then, start the frontend server:

```sh
npm start
```

After that, in another console, run the following command to run the end-to-end tests:

```sh
npm run cypress:run
```

The tests will be run in a headless browser and their results will be visible in the console.
