pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"
        IMAGE_NAME = "demonstrationorg/basic-node-app"
        SHA = "${env.GIT_COMMIT}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Yusful33/basic-scout-demo.git'
            }
        }

        stage('Setup Docker Buildx') {
            steps {
                sh 'docker run --rm --privileged multiarch/qemu-user-static --reset -p yes'
                sh 'docker buildx create --name mybuilder --use'
                sh 'docker buildx inspect --bootstrap'
            }
        }

        stage('Authenticate to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo '${DOCKER_PASSWORD}' | docker login -u '${DOCKER_USERNAME}' --password-stdin ${REGISTRY}"
                }
            }
        }

        stage('Extract Docker Metadata') {
            steps {
                script {
                    env.TAGS = "type=edge,branch=main type=sha,prefix=,suffix=,format=short"
                    env.LABELS = "org.opencontainers.image.revision=${SHA}"
                }
            }
        }

        stage('List Directory Contents') {
            steps {
                sh 'ls -R ./basic-scout-demo'
            }
        }

        stage('Set Up Docker Buildx (Cloud)') {
            steps {
                sh """
                docker buildx create --name mybuilder --use
                docker buildx inspect --bootstrap
                """
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                sh """
                docker buildx build --platform linux/amd64,linux/arm64 \
                --push \
                --file ./basic-scout-demo/basic-scout-demo/BasicNodeApp/Dockerfile \
                --tag ${REGISTRY}/${IMAGE_NAME}:${SHA} \
                --label ${LABELS} \
                ./basic-scout-demo/basic-scout-demo/BasicNodeApp
                """
            }

        }
    }


    post {
        success {
            echo "✅ Build and push completed successfully!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}