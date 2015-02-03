function MainPageController($scope, $http, $location){
    $scope.signUp = function(){
        $http.post('/api/users/register', {email: $scope.email, password: $scope.password}).
            success(function(data, status, headers, config) {

                $location.path('/users')
            }).
            error(function(data, status, headers, config) {
                $scope.errorsMessages = data;
                $scope.email = "";
                $scope.password = "";
            });
    };

    $scope.logIn = function() {
        $scope.errorsMessages = null;
        $http.post('/api/users/authenticate', {email: $scope.email, password: $scope.password}).
            success(function(data, status, headers, config){
                $location.path('/users');
            }).
            error(function(data, status, headers, config){
                $scope.errorsMessages = data;
                $scope.password = "";
            })
    }
};

function UserController($scope, $http) {

    $http.get('/api/users')
        .success(function(data, status, headers, config){
            $scope.users = data;
        })

}
