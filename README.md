# Distributed Computing WebWorker

## Frontend

Frontend readme is available under `./frontend`.

## Server

### Prerequisites

#### Linux

- Install [.NET Core 2.1](https://www.microsoft.com/net/download/dotnet-core/2.1)
- Install latest [mono](https://www.mono-project.com/docs/getting-started/install/).
- Set enviroment variable with path to `mono` compiler
  - `export FrameworkPathOverride=/usr/lib/mono/4.5/`

#### Windows

- Install [.NET Core 2.1](https://www.microsoft.com/net/download/dotnet-core/2.1)

### Building and running

In order to build whole project run:

```bash
 dotnet build
```

In order to start `Server` module run:

```bash
dotnet run --project Server
```
