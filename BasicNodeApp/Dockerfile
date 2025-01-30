# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7
## npm install --save grafana-openai-monitoring | npm uninstall --save grafana-openai-monitoring
## Build Cloud Multi-Architecture
# docker buildx build  --builder cloud-dockersales-yusuf-basic-nlp --platform=linux/amd64,linux/arm64 --provenance=true --attest type=sbom -t demonstrationorg/basic-node-app:0.0.5 . --push 

# docker buildx build  --builder cloud-dockersales-yusuf-basic-nlp --provenance=true --attest type=sbom -t demonstrationorg/basic-node-app:0.0.4 . 
## docker scout repo enable demonstrationorg/basic-node-app
# docker buildx build  --builder cloud-dockersales-yusuf-basic-nlp --platform=linux/amd64,linux/arm64 --provenance=true --attest type=sbom -t demonstrationorg/basic-node-app:0.0.5 . --push 
# 21.5

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["node", "app.js"]
