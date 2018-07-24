myApp.controller('ProjectCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $stateParams, $analytics) {
    $scope.template = TemplateService.getHTML("content/project/project.html");
    TemplateService.title = "Project"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();

    $scope.gaViewDemo = function (name) {
        $analytics.eventTrack(name, {
            category: 'View Demo'
        });
    };

    $scope.dataId = {
        _id: $stateParams.id
    };

    $scope.project = undefined;

    NavigationService.callApiWithData("Projects/getOne", $scope.dataId, function (data) {
        $scope.project = [];
        $scope.project = data.data;
        $scope.project.verifyName = _.toLower($scope.project.name);
        TemplateService.title = $scope.project.name; // This is the Title of the Website
    });

    $scope.submitForm = function (data) {
        return new Promise(function (callback) {
            $timeout(function () {
                callback();
            }, 5000);
        });
    };

    $scope.requestBtnClicked = false;
    $scope.submitRequestForm = function (projectName, valid) {
        if (valid) {
            $scope.apiCalling = true;
            $scope.requestData = {};
            $scope.requestData.project = projectName;
            $scope.requestData.project.projectName = $scope.project.name;
            $scope.requestData.tokenKey = $.jStorage.get("user").tokenKey;
            $analytics.eventTrack('Request a Demo', {
                category: $scope.project.name,
                label: $scope.requestData.project.userEmail
            });
            NavigationService.callApiWithData("Projects/requestDemo", $scope.requestData, function (data) {
                if (data.value) {
                    swal({
                        type: 'success',
                        title: 'We have received your request!',
                        text: 'We will soon get in touch with you.'
                    });
                    $scope.apiCalling = false;
                }
                $scope.requestBtnClicked = false;
                $scope.requestInstance.close();
            });
        } else {
            $scope.requestBtnClicked = true;
            $scope.apiCalling = false;
        }
    };

    $scope.openRequest = function () {
        $scope.requestInstance = $uibModal.open({
            animation: true,
            templateUrl: "views/content/request-demo/request-demo.html",
            scope: $scope,
            size: 'lg',
        });
    };

    $scope.openContact = function () {
        $scope.contactInstance = $uibModal.open({
            animation: true,
            templateUrl: "views/content/contactus/contactus.html",
            scope: $scope,
            size: 'lg',
            // backdropClass: 'back-drop'
        });
    };

    $scope.openFeedback = function () {
        $scope.feedbackInstance = $uibModal.open({
            animation: true,
            templateUrl: "views/content/feedback/feedback.html",
            scope: $scope,
            size: 'lg',
            // backdropClass: 'back-drop'
        });
    }


    $scope.checklen = function (data) {
        $scope.contacterror = "";
        var len = data.length;
        if (len < 10) {
            $scope.contacterror = "Please enter a valid phone number";
        } else if (len == 10) {
            $scope.contacterror = "";
        }
    }


    //contactus form
    $scope.submitForm = false;
    $scope.contactForm = {};
    $scope.contactBtnClicked = false;
    $scope.submitcontactForm = function (data, valid) {
        if (valid) {
            $scope.apiCalling = true;
            $scope.data = {};
            $scope.data.userEmail = data.userEmail;
            $scope.data.name = data.name;
            $scope.data.number = data.number;
            $scope.data.comments = data.comments;
            NavigationService.callApiWithData('Contact/contactUs', $scope.data, function (data) {
                if (data.value) {
                    $scope.apiCalling = false;
                    $scope.contactInstance.close();
                    $scope.contactForm = {};
                    swal({
                        type: 'success',
                        title: 'Thank you for contacting us!',
                        text: 'We will be in touch with you shortly.'
                    });
                } else {
                    $scope.apiCalling = false;
                    $scope.contactInstance.close();
                    $scope.contactForm = {};
                }
            });
        } else {
            $scope.contactBtnClicked = true;
        }
    };

    $scope.clearData = function () {
        $scope.contactForm = {};
    };

    //feedback form
    $scope.submitForm = false;
    $scope.feedbackForm = {};
    $scope.feedbackBtnClicked = false;
    $scope.apiCalling = false;
    $scope.submitfeedbackForm = function (data, valid, rating) {
        if (valid && rating != 0) {
            $scope.apiCalling = true;
            $scope.data = {};
            $scope.data.userEmail = data.userEmail;
            $scope.data.comment = data.comment;
            $scope.data.rating = data.rating;
            $scope.data.project = $scope.project.name;
            NavigationService.callApiWithData('Feedback/feedback', $scope.data, function (data) {
                if (data.value) {
                    $scope.apiCalling = false;
                    $scope.feedbackInstance.close();
                    $scope.feedbackForm = {};
                    swal({
                        type: 'success',
                        title: 'Thank you!',
                        text: 'Your feedback is valuable to us.'
                    });
                } else {
                    $scope.apiCalling = false;
                    $scope.feedbackInstance.close();
                    $scope.feedbackForm = {};
                }
            });
        } else {
            $scope.feedbackBtnClicked = true;
        }

    };


    $scope.clearDataFeedback = function () {
        $scope.feedbackForm = {};
    }
});