
var app = angular.module('blogApp', ['ngRoute']);


app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication ($window, $http) {

    var saveToken = function (token) {
        $window.localStorage['blog-token'] = token;
    };

    var getToken = function () {
        return $window.localStorage['blog-token'];
    };

    var register = function(user) {
        console.log('Registering user ' + user.email + ' ' + user.password);
        return $http.post('/api/register', user).success(function(data){
	    saveToken(data.token);
        });
    };

    var login = function(user) {
        console.log('Attempting to login user ' + user.email + ' ' + user.password);
        return $http.post('/api/login', user).success(function(data) {
            saveToken(data.token);
	});
    };

    var logout = function() {
        $window.localStorage.removeItem('blog-token');
    };

    var isLoggedIn = function() {
        var token = getToken();
	
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var currentUser = function() {
        
        if(isLoggedIn()){
	    var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
                email : payload.email,
                name : payload.name
            };
        }
    };
    return {
        saveToken : saveToken,
        getToken : getToken,
        register : register,
	login : login,
        logout : logout,
        isLoggedIn : isLoggedIn,
        currentUser : currentUser
    };
}

//*** Router Provider ***
app.config(function($routeProvider) {
  $routeProvider
	.when('/', {
	    templateUrl: 'home.html',
	    controller: 'homeController',
	    controllerAs: 'vm'
	})

	.when('/list', {
	    templateUrl: 'list.html',
	    controller : 'listController',
            controllerAs: 'vm'
	})

	.when('/add', {
	    templateUrl: 'add.html',
	    controller: 'addController',
            controllerAs: 'vm'
	})
        .when('/edit/:blogid', {
	    templateUrl: 'edit.html',
	    controller: 'editController',
            controllerAs: 'vm'
	})
	.when('/remove/:blogid', {
	    templateUrl: 'remove.html',
	    controller: 'removeController',
	    controllerAs: 'vm'
	})
	.when('/login', {
	    templateUrl: 'login.html',
	    controller: 'LoginController',
	    controllerAs: 'vm'
	})
	.when('/register', {
	    templateUrl: 'register.html',
	    controller: 'RegisterController',
	    controllerAs: 'vm'
	})
	.when('/addComment/:blogid', {
	    templateUrl: 'addComment.html',
	    controller: 'addCommentController',
	    controllerAs: 'vm'
	})
	.when('/editComment/:blogid', {
	    templateUrl: 'editComment.html',
	    controller: 'editCommentController',
	    controllerAs: 'vm'
	})
	.when('/removeComment/:blogid', {
	    templateUrl: 'removeComment.html',
	    controller: 'removeCommentController',
	    controllerAs: 'vm'
	})
	.otherwise({redirectTo: '/'});
});

//*** Controllers ***
app.controller('homeController', function homeController() {
    var vm = this;
    vm.homeHeader = "Joshua Kilhefner's Blog Site";
    vm.homeText = "Welcome to my blog site";
});

app.controller('listController',[ '$http', '$scope', '$interval', 'authentication', function listController($http, $scope, $interval, authentication) {
    var vm = this;
    vm.listHeader = "Blog List";
    vm.isLoggedIn = function() {
	return authentication.isLoggedIn();
    }

    vm.isAuthor = function(blogs) {
	return vm.isLoggedIn() && authentication.currentUser().email == blogs.userEmail;
    }
    
    getAllBlogs($http)
	.success(function(data) {
	    vm.blog = data;
	})
    // Refreshes lists of blogs periodically  
    $scope.callAtInterval = function() {
	console.log("Interval occurred");
	getAllBlogs($http)
	    .success(function(data) {
		vm.blog = data;
		vm.message = "Blogs list found!";
	    })
	    .error(function (e) {
		vm.message = "Could not get list of blogs";
	    });  
    }
    $interval( function(){$scope.callAtInterval();}, 3000, 0, true);
}]);

app.controller('editController',[ '$http', '$routeParams', '$location', 'authentication', function editController($http, $routeParams, $location, authentication){
    var vm = this;
    var id = $routeParams.blogid;

    vm.isLoggedIn = function() {
	return authentication.isLoggedIn();
    }
    
    getBlogByID($http, id)                                                        
	.success(function(data) {
            console.log("success");
            vm.blog = data;
	})
    vm.submit = function() {
        var data = vm.blog;
	data.blogTitle = userForm.blogTitle.value;                                               data.blogText = userForm.blogText.value;
        updateBlog($http, id, data, authentication)                                                          .success(function(data) {
            console.log("UPDATED");         
	    $location.path('/list').replace();
	})                                                                           
    }
}]);

app.controller('removeController', ['$http', '$routeParams', '$location', 'authentication', function removeController($http, $routeParams, $location, authentication) {
    var vm = this;
    var id = $routeParams.blogid;

    vm.isLoggedIn = function () {
	return authentication.isLoggedIn();
    }
	
    getBlogByID($http, id)
        .success(function(data) {
	    console.log("success");
            vm.blog = data;
	})
    vm.submit = function() {
	deleteBlog($http, id, authentication)
            .success(function(data) {
		console.log("DELETED");
		$location.path('/list').replace();
            })
    }
}]);

app.controller('addController', ['$http', '$location' , 'authentication', function addController($http, $location, authentication) {
    var vm = this;
    console.log(vm.blog);
    vm.blog = {};
    vm.submit = function(){
	var data = vm.blog;
	data.blogTitle = userForm.blogTitle.value;
	data.blogText = userForm.blogText.value;
	data.userName = authentication.currentUser().name;
	data.userEmail = authentication.currentUser().email;
	data.comment = null;
	data.commentorName = null;
	data.commentorEmail = null;
	
	addBlog($http, data, authentication)
	    .success(function(data) {
		console.log("ADDED");
		$location.path('/list').replace();
	    })
    }
}]);


app.controller('LoginController', [ '$http', '$location', 'authentication', function LoginController($htttp, $location, authentication) {
    var vm = this;

    vm.pageHeader = {
	title: 'Sign in to Blogger'
    };

    vm.credentials = {
	email : "",
	password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
	vm.formError = "";
	if (!vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
	} else {
            vm.doLogin();
	}
    };

    vm.doLogin = function() {
	vm.formError = "";
      authentication
            .login(vm.credentials)
            .error(function(err){
		var obj = err;
		vm.formError = obj.message;
            })
            .then(function(){
		$location.search('page', null); 
		$location.path(vm.returnPage);
            });
    };
}]);

app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($htttp, $location, authentication) {
    var vm = this;
    
    vm.pageHeader = {
	title: 'Create a new Blogger account'
    };
    
    vm.credentials = {
	name : "",
	email : "",
	password : ""
    };
    
    vm.returnPage = $location.search().page || '/';
    
    vm.onSubmit = function () {
	vm.formError = "";
	if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
	} else {
            vm.doRegister();
	}
    };

    vm.doRegister = function() {
	vm.formError = "";
      authentication
            .register(vm.credentials)
            .error(function(err){
          vm.formError = "Error registering. Try again with a different email address."
          //vm.formError = err;
            })
            .then(function(){
		$location.search('page', null); 
		$location.path(vm.returnPage);
            });
    };
}]);

app.controller('addCommentController', [ '$http', '$routeParams', '$location'/*, 'authentication'*/, function addCommentController($http, $routeParams, $location/*, authentication*/) {
    var vm = this;
    var id = $routeParams.blogid;

    vm.isLoggedIn = function() {
	return authentication.isLoggedIn();
    }

    getBlogByID($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blog = data;
	})
    vm.submit = function() {
	var data = vm.blog;
	data.comment = userForm.comment.value;
	addComment($http, id, data/*, authentication*/)
	    .success(function(data) {
		console.log("ADDED");
		$location.path('/list').replace();
	    })
    }
}]);

app.controller('editCommentController', [ '$http', '$routeParams', '$location', 'authentication', function editCommentController($http, $routeParmas, $location, authentication) {
    var vm = this;
    var id = $routeParams.blogid;

    vm.isLoggedIn = function() {
	return authenication.isLoggedIn();
    }

    getBlogByID($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blog = data;
	})
    vm.submit = function() {
	var data = vm.blog;
	data.comment = userForm.comment.value;
	editComment($http, id, data, authentication)
	    .success(function(data) {
		console.log("UPDATED");
		$location.path('/list').replace();
	    })
    }
}]);

app.controller('removeCommentController', [ '$http', '$routeParams', '$location', 'authenticaton', function removeCommentController($http, $routeParams, $location, authentication) {
    var vm = this;
    var id = $routeParams.blogid;

    vm.isLoggedIn = function() {
	return authentication.isLoggedIn();
    }

    getBlogByID($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blog = data;
	})
    vm.submit = function() {
	var data = vm.blog;
	data.domment = userForm.comment.value;
	removeComment($http, id, data, authentication)
	    .success(function(data) {
		console.log("REMOVED");
		$location.path('/list').replace();
	    })
    }
}]);
       
function getAllBlogs($http){
    return $http.get('/api/blog');
}

function addBlog($http, data, authentication) {
    return $http.post('/api/blog', data, { headers: {Authorization: 'Bearer '+ authentication.getToken()}});
}

function getBlogByID($http, blogid){
    return $http.get('/api/blog/'+ blogid);
}
function updateBlog($http, blogid, data, authentication) {
    return $http.put('/api/blog/'+ blogid, data);
}

function deleteBlog($http, blogid, authentication){
    return $http.delete('/api/blog/'+ blogid, { headers: {Authorization: 'Bearer '+ authentication.getToken()}});
}

function addComment($http, blogid, data, authentication) {
    return $http.put('/api/blog/' + blogid, data);
}

function editComment($http, blogid, data, authentication) {
    return $http.put('/api/blog/' + blogid, data);
}

function removeComment($http, blogid, data, authentication) {
    return $http.put('/api/blog/' + blogid, data);
}
