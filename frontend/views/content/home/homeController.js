myApp.controller('HomeCtrl', function ($rootScope, $scope, TemplateService, NavigationService, $timeout, toastr, $http, $state, $stateParams, $uibModal, $analytics) {
    $scope.template = TemplateService.getHTML("content/home/home.html");
    TemplateService.title = "Let us start a revolution of ideas to create change that lasts"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();

    $scope.gaViewDemo = function (name) {
        $analytics.eventTrack(name, {
            category: 'View Demo'
        });
    };

    NavigationService.callApi("Projects/featuredProjects", function (data) {
        $scope.mySlidess = data.data;
        $timeout(function () {
            var mySwiper = new Swiper('.swiper-container', {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                autoplay: {
                    delay: 5000,
                }
            });
            $('.swiper-container').on('mouseenter', function (e) {
                mySwiper.autoplay.stop();
            });
            $('.swiper-container').on('mouseleave', function (e) {
                mySwiper.autoplay.start();
            });
        }, 300);
    });


    $scope.scrollTo = function (scrollPos) {
        $('html, body').animate({
            scrollTop: scrollPos
        }, 0);
    };

    $scope.projectType = [{
            type: 'TUI Solutions',
            id: "TUI Projects"
        }, {
            type: 'TUI Innovative Pilots',
            id: "Innovative PoC"
        },
        // {
        //     type: 'TUI Potential Pilots',
        //     id: "Potential Poc"
        // },
        {
            type: 'Cross Industry Innovations',
            id: "More Innovations"
        }
    ];


    $scope.clickType = function (id) {
        $rootScope.projectId = id;
        $scope.type = id;
        $scope.selected = id;
    };

    $scope.getProjects = function () {
        NavigationService.callApi('Projects/all', function (data) {
            if (data) {
                $scope.mySlides2 = data.data;
                if ($rootScope.projectId) {
                    $scope.clickType($rootScope.projectId);
                } else {
                    $scope.clickType($scope.projectType[0].id);
                }

                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams, options) {
                        if (toState.name == 'app.home') {
                            if ($rootScope.homeScroll) {
                                $timeout(function () {
                                    $scope.scrollTo($rootScope.homeScroll);
                                }, 600);
                            }
                        }
                    });

            }
        });
    };

    $scope.getProjects();

    $scope.clickProject = function (id) {
        $scope.id = id;
        $state.go('app.project', {
            'id': $scope.id
        });
    };

    $scope.mySlides = [{
            img: 'img/slider-image1.png',
            title: 'Marco Polo 1',
            subtitle: 'An AR application to be used on Destinations, Cruises & more.'
        }, {
            img: 'img/slider-image1.png',
            title: 'Marco Polo 2',
            subtitle: 'An AR application to be used on Destinations, Cruises & more.'
        },
        {
            img: 'img/slider-image1.png',
            title: 'Marco Polo 3',
            subtitle: 'An AR application to be used on Destinations, Cruises & more.'
        }
    ];



    //DISCUSS NOW MODAL
    $scope.openContact = function () {
        $scope.contactInstance = $uibModal.open({
            animation: true,
            templateUrl: "views/content/contactus/contactus.html",
            scope: $scope,
            size: 'lg',
            // backdropClass: 'back-drop'
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


    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams, options) {
            if (fromState.name == 'app.home') {
                $rootScope.homeScroll = $(window).scrollTop();
            }
        });
});