pipeline {
    agent {label 'Mikrus'}
    tools {nodejs "nodejs"}
    stages {
        stage('Run Cypress tests') {
            sh 'npm test'
        },
        stage('Deliver') { 
            steps {
                sh 'chmod +x ./scripts/deploy.sh'
                sh './scripts/deploy.sh'
            }
        }
    }
}