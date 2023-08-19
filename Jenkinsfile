pipeline {
    agent {
        label {
            "Mikrus"
        }
    }
    stages {
        stage('Deliver') { 
            steps {
                sh './scripts/deploy.sh'
            }
        }
    }
}