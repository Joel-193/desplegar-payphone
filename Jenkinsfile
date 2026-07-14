pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sh 'pm2 restart joelstore || pm2 start server.js --name joelstore'
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente. Deploy completado.'
        }
        failure {
            echo 'Error en el pipeline. Revisar logs.'
        }
    }
}
