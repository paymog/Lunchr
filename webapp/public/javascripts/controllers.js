function MainPageController($scope, $http, $location){
    $scope.signUp = function(){
        $http.post('/api/users', {email: $scope.email, password: $scope.password}).
            success(function(data, status, headers, config) {

                $location.path('/users')
            }).
            error(function(data, status, headers, config) {
                alert("Something went wrong :(");
            });
    };

    $scope.logIn = function() {
        $location.path('/users');
    }
};

function UserController($scope, $http) {

    $http.get('/api/users')
        .success(function(data, status, headers, config){
            $scope.users = data;
        })

}
