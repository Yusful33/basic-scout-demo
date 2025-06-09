# Containerized Repo App

## Getting Started
* Install your favorite IDE or TextEditor
* Install Docker Desktop


## DHI Demo Workflow 
* `docker build --no-cache  -t demonstrationorg/basic-dhi-demo:unhardened -f Dockerfile .`
    * Observe cves both from a npm and base package perspective
    * Update npm package `npm install express@4.21.2`
    * Reduction but not complete elimination of CVEs
* Dig into base image CVEs 
    * `docker scout sbom --format list node:20.19.2-alpine3.21`
* Navigate to Docker Hub DHI Catalog within Browser https://hub.docker.com/orgs/demonstrationorg/repositories
* Identify correct DHI Image 
* Rebuild image using DHI Dev variant 
    * Run `docker build --no-cache  -t demonstrationorg/basic-dhi-demo:dev-hardened -f dhi.Dockerfile .`
    * Speak to package bloat and multi-stage builds
* Utilize Multi-Stage Build 
    * `docker build --no-cache  -t demonstrationorg/basic-dhi-demo:prod-hardened -f multi-dhi.Dockerfile .`



## Security Check
* `docker scout cves`
* `docker scout sbom`

## Live Rebuild
* `docker compose --env-file ./conf/dev.env alpha watch`

## Speed
* `docker login`
* `docker buildx create --driver cloud --name cloud-build docker/devrel`
* `docker buildx use cloud-build --global`
* `docker buildx ls`

## Back To Defaults
* `docker context use default`
* `docker buildx use default --global`