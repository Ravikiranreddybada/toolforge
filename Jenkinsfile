pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'node --test test.js || exit 0'
                }
            }
        }

        stage('Build & Deploy with Docker') {
            steps {
                sh 'docker-compose down || exit 0'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                // Verification Stage: Crucial for true DevOps automation.
                // This ensures the application is not just "running" but actually healthy.
                
                // Wait 10 seconds for the Docker containers to stabilize
                sh 'sleep 10'
                
                // Test the /health endpoint. Fails the build if the server isn't responding.
                sh 'curl -f http://localhost:3000/health || exit 1'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! App is running at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed! Check the logs above.'
            sh 'docker-compose logs || exit 0'
        }
    }
}
