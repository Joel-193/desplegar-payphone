pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        NODE_ENV = 'test'
        PAYPHONE_TOKEN = credentials('payphone-token')
        PAYPHONE_STORE_ID = credentials('payphone-store-id')
        PAYPHONE_CONFIRM_URL = credentials('payphone-confirm-url')
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

        stage('Build Docker') {
            steps {
                sh 'docker build -t joelstore-payphone:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop joelstore-payphone || true
                    docker rm joelstore-payphone || true
                    docker run -d --name joelstore-payphone -p 3000:3000 \
                      -e PORT=3000 \
                      -e PAYPHONE_TOKEN="${PAYPHONE_TOKEN}" \
                      -e PAYPHONE_STORE_ID="${PAYPHONE_STORE_ID}" \
                      -e PAYPHONE_CONFIRM_URL="${PAYPHONE_CONFIRM_URL}" \
                      joelstore-payphone:latest
                '''
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
