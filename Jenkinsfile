pipeline {
    agent any
    stages {
        stage('Prepare') {
            steps {
                script {
                    git url: 'https://github.com/tirador1201/fakerestapi.git', branch: "main"
                }
            }
        }
        stage('Run Tests') {    
            steps {
                script {
                    sh """
                        docker build -t fakerest/1.0 .
                        docker run --env BASE_URL=https://fakerestapi.azurewebsites.net --name $BUILD_NUMBER fakerest/1.0
                    """
                }
            }
            post {
                always {
                    script {
                        sh """
                            docker cp $BUILD_NUMBER:/app/allure-results .
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            allure includeProperties: false,
                  jdk: '',
                  reportBuildPolicy: 'ALWAYS',
                  results: [[path: 'allure-results']]
        }
    }
}