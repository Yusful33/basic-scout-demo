# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/
## npm install --save grafana-openai-monitoring | npm uninstall --save grafana-openai-monitoring
## docker buildx build --no-cache --sbom=true --provenance=mode=max -t demonstrationorg/basic-dhi-demo:unhardened -f Dockerfile . 
## express 4.17.1 to 4.21.2
##LGPL Licensing issues...


FROM node:20.19.2-alpine3.21

## View SBOM docker scout sbom --format list  node:20.19.2-alpine3.21


# Use production node environment by default.
ENV NODE_ENV=production


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
COPY . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD node index.js
