

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/
## npm install --save grafana-openai-monitoring | npm uninstall --save grafana-openai-monitoring
## docker  build --no-cache --provenance=true --attest type=sbom -t demonstrationorg/dhi-demo:0.2 .
## docker build --no-cache  -t demonstrationorg/basic-dhi-demo:prod-hardened -f multi-dhi.Dockerfile . 
##LGPL Licensing issues...

# ARG NODE_VERSION=20.19.2

# FROM node:${NODE_VERSION}-alpine
# FROM alpine:latest
FROM demonstrationorg/dhi-node:20.19.2-alpine3.21-dev as dev


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
#package-lock.json provides a more detailed snapshot of current state as opposed to packge.json
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . /app

#--Prod Stage --
FROM demonstrationorg/dhi-node:20.19.2-alpine3.21 as prod

COPY --from=dev /app /app

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD node index.js