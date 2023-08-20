pipeline {
    agent {label 'Mikrus'}
    stages {
        stage('Deliver') { 
            steps {
                sh 'chmod +x ./scripts/deploy.sh'
                sh './scripts/deploy.sh'
            }
        }
    }
}