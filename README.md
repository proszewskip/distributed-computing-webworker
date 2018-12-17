# Distributed Computing WebWorker

## Frontend

Frontend readme is available under `./frontend`.

## Server

### Prerequisites

#### Linux

- Install [docker](https://www.docker.com/get-started)
- Install [docker-compose](https://docs.docker.com/compose/install/)
- Install [.NET Core 2.1](https://www.microsoft.com/net/download/dotnet-core/2.1)
- Install latest [mono](https://www.mono-project.com/docs/getting-started/install/).
- Install latest [nuget](https://docs.microsoft.com/pl-pl/nuget/install-nuget-client-tools).
- Set enviroment variable with path to `mono` compiler
  - `export FrameworkPathOverride=/usr/lib/mono/4.5/`

#### Windows

- Install [docker](https://www.docker.com/get-started)
- Install [docker-compose](https://docs.docker.com/compose/install/)
- Install [.NET Core 2.1](https://www.microsoft.com/net/download/dotnet-core/2.1)

### Building and running

In order to build whole project run:

```bash
 nuget restore
 dotnet build
```

In order to start `Server` module run:

```bash
docker-compose up -d
dotnet run --project Server
```
