myApp.controller('headerCtrl', function ($scope, TemplateService) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);
});

myApp.controller('headCtrl', function ($scope, $uibModal, $state, NavigationService) {

    $scope.currentState = $state.current.name;

    //DISCUSS NOW MODAL
    $scope.openContact = function () {
        $scope.contactInstance = $uibModal.open({
            animation: true,
            templateUrl: "views/content/contactus/contactus.html",
            scope: $scope,
            size: 'lg',
            backdropClass: 'back-drop'
        });
    };
    //DISCUSS NOW- CONTACT FORM VALIDATIONS
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
    };
});