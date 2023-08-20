pipeline {
    agent {label 'Mikrus'}
    stages {
        stage('Deliver') { 
            steps {
                sh 'chmod +x -R ${env.WORKSPACE}'
                sh './scripts/deploy.sh'
            }
        }
    }
}