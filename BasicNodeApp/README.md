## Docker Desktop 
* git clone https://github.com/Yusful33/basic-scout-demo.git
* cd BasicNodeApp
* illustrate docker file
* illustrate docker compose file
* docker compose watch
* localhost:3000
* docker ps
* docker ps -a
* docker logs <container_id>
    * address variable name
* localhost:3000
    * input city
    * view results
    * View all data (show that its messy)
* Go into postgres container 
    * docker ps
    * docker debug <container_id> OR (docker exec -it <container_id> bash)
    * psql -h localhost -U postgres
    * select * from weather_data;
## Docker Build Cloud
* Happy with results, go back into slides on DBC
    * Configure builder in DD to be used 
    * Suppose new dev joined team and wants to uplevel app with a grafana package openai package
        * npm install --save grafana-openai-monitoring
    * lets go ahead and build the image for the server
    * Will go throug this prcess twice
        * docker buildx build --platform=linux/amd64,linux/arm64 --no-cache --provenance=true --attest type=sbom -t demonstrationorg/basic-node-app:0.0.1 . —push
        * docker pull demonstrationorg/basic-node-app:0.0.1
## Docker Scout
* Go Back into Slides on Scout
    * docker scout quickview demonstrationorg/basic-node-app:0.0.1
    * docker scout policy demonstrationorg/basic-node-app:0.0.4 --org demonstrationorg
    * Uninstall NPM 
        * npm uninstall --save grafana-openai-monitoring
    * Restart Process of building images and validate changes 
    * Open pull request once satisfied with updated version
    * Highlight integrate with gh actions in yaml file
    * Highlight Gh pull request integration with Scout
    * Navigate to Scout dashboard to show a higher level overview into the builds 
## Testcontainers Cloud
    * npm install testcontainers --save-dev
    * npm install jest --save-dev
    * npm install @testcontainers/postgresql --save-dev
    * npm test