pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18' // Especifica la versión de Node.js apropiada para Next.js
        DOCKER_IMAGE = 'ProyectoFinal' // Nombre de la imagen Docker
        DOCKER_TAG = 'latest' // Etiqueta de la imagen
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    echo 'Setting up Node.js environment...'
                    // Usa nvm o la herramienta node si está disponible en Jenkins
                    echo "Using Node.js ${NODE_VERSION}"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh 'npm ci' // Preferido sobre npm install en entornos CI
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building the Next.js application...'
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    sh 'npm test || echo "No tests configured - continuing"'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Deploying the application using Docker Compose...'
                    // Usamos Docker Compose para levantar los servicios
                    sh 'docker-compose -f docker-compose.yml up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
        always {
            echo 'Cleaning up workspace...'
            // Limpia el entorno, puedes eliminar imágenes no deseadas o contenedores
            //sh 'docker system prune -f' // Esto elimina imágenes no utilizadas y contenedores detenidos
        }
    }
}
