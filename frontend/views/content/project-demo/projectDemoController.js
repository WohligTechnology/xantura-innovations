myApp.controller('ProjectDemoCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $stateParams, $sce, $state) {
    $scope.template = TemplateService.getHTML("content/project-demo/project-demo.html");
    $scope.template.header = "views/template/project-header.html";
    $scope.template.footer = "";
    var trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    };
    $scope.url = trustSrc($stateParams.url);
    $scope.id = $stateParams.id;

    $scope.goBack = function () {
        if ($scope.id) {
            $state.go('app.project', {
                id: $scope.id
            });
        } else {
            $state.go('app.home');
        }
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

    $scope.submitForm = false;
    $scope.contactForm = {};
    $scope.contactBtnClicked = false;
    $scope.apiCalling = false;
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
    }


});