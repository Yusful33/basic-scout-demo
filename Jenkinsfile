pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_IMAGE = "demonstrationorg/basic-node-app"
        SHA = "${env.GIT_COMMIT}"
        BUILD_CLOUD = "dockersales/yusuf-basic-nlp"
    }

    stages {
        stage('Checkout Code') {
            steps {
                cleanWs() // Cleans workspace before pulling fresh code
                git branch: 'main', url: 'https://github.com/Yusful33/basic-scout-demo.git'
            }
        }

    stage('Time-Consuming Computation') {  // 🔹 New Step (Not Related to Docker)
            steps {
                script {
                    echo "Starting a CPU-intensive task..."
                    sh '''
                    python3 -c "
                        import time
                        import numpy as np

                        print('Generating large random matrix...')
                        matrix = np.random.rand(5000, 5000)  # 5000x5000 Matrix
                        print('Performing matrix multiplication...')
                        result = np.matmul(matrix, matrix)
                        print('Computation completed!')
                        time.sleep(5)  # Simulate additional processing delay
                    "
                    '''
                }
            }
    }

        stage('Setup Docker Buildx') {
                    steps {
                        script {
                            // Check if "mybuilder" exists, otherwise create it
                            def existingBuilder = sh(script: "docker buildx ls | grep mybuilder || true", returnStdout: true).trim()
                            if (existingBuilder) {
                                echo "✅ Using existing buildx instance: mybuilder"
                            } else {
                                sh "docker buildx create --name mybuilder --use"
                                sh "docker buildx inspect --bootstrap"
                            }
                        }
                    }
                }
        

        stage('Authenticate to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    '''
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

        stage('List Directory Structure') {
            steps {
                sh 'ls -R'
            }
        }

        
        stage('List Directory Contents') {
            steps {
                sh 'ls -R ./BasicNodeApp'
            }
        }


        stage('Build and Push to Docker Hub') {
            steps {
                sh """
                docker buildx build --platform linux/amd64,linux/arm64 \
                --push \
                --file ./BasicNodeApp/Dockerfile \
                --tag ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest \
                ./BasicNodeApp
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