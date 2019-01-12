FROM node:10

WORKDIR /app
ENV INSIDE_CONTAINER=1

# Install dependencies
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci

# Build the project
COPY ./ ./
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
