pipeline {
    agent {label 'Mikrus'}
    tools {nodejs "nodejs"}
    stages {
        stage('Deliver') { 
            steps {
                sh 'chmod +x ./scripts/deploy.sh'
                sh './scripts/deploy.sh'
            }
        }
    }
}