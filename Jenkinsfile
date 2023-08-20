pipeline {
    agent {label 'Mikrus'}
    stages {
        stage('Deliver') { 
            steps {
                bash 'chmod +x -R /scripts/deploy.sh'
                bash './scripts/deploy.sh'
            }
        }
    }
}