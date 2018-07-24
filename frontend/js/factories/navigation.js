var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile";

myApp.factory('NavigationService', function ($http) {
    var navigation = [{
        name: "Home",
        classis: "active",
        anchor: "home",
        subnav: [{
            name: "Subnav1",
            classis: "active",
            anchor: "home"
        }]
    }, {
        name: "Login",
        classis: "active",
        anchor: "login",
        subnav: []
    }, {
        name: "Project",
        classis: "active",
        anchor: "project",
        subnav: []
    }];

    return {
        getNavigation: function () {
            return navigation;
        },

        callApi: function (url, callback) {
            $http.post(adminurl + url).then(function (data) {
                data = data.data;
                callback(data);
            });
        },

        callApiWithData: function (url, formData, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data);

            });
        },



    };
});