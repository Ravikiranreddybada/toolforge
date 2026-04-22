pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // We skip local 'npm install' because our Dockerfile 
        // already handles dependency installation during the build.
        
        stage('Build & Deploy') {
            steps {
                // Use --force-recreate to ensure we don't have naming conflicts
                sh 'docker compose up -d --build --force-recreate --remove-orphans'
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 20'
                // Check if the app is responding correctly
                sh 'curl -f http://localhost:3000/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Succeeded! App is live at http://localhost:3000'
        }
        failure {
            echo '❌ Pipeline Failed! Generating logs...'
            sh 'docker compose logs --tail=50 || true'
        }
    }
}
