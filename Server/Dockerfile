FROM microsoft/dotnet:sdk AS build-env
WORKDIR /app

# Install mono
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  apt-transport-https \
  ca-certificates-mono \
  mono-devel \
  nuget

ENV FrameworkPathOverride=/usr/lib/mono/4.5/

# Copy csproj and restore as distinct layers
COPY ./Server/*.csproj ./Server/
COPY ./Server.Tests/*.csproj ./Server.Tests/
COPY ./DistributedComputingLibrary/*.csproj ./DistributedComputingLibrary/
COPY ./Packager/*.csproj ./Packager/
COPY ./*.sln ./
RUN dotnet restore

# Copy everything else and build
COPY ./Server/ ./Server/
COPY ./Server.Tests/ ./Server.Tests/
COPY ./DistributedComputingLibrary ./DistributedComputingLibrary/
COPY ./Packager/ ./Packager/
RUN nuget restore
RUN dotnet publish Server -c Release -o out --runtime linux-x64

# Build runtime image
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /app
RUN mkdir /task-definitions /compiled-task-definitions
COPY ./mono-wasm-sdk /mono-wasm-sdk
COPY --from=build-env /app/Server/out .
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://*:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "Server.dll"]
