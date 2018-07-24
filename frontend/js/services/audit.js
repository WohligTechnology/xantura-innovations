myApp.service('AuditService', function ($http) {
    var token = $.jStorage.get("user").tokenKey;
    this.create = function (activity) {

        var params = {
            token: token,
            activity: activity
        };

        $http({
            url: adminurl + 'usageLogs/logActivity',
            params: params,
            method: 'POST'
        }).then(function (response) {
            console.log("response", response);
        }).catch(function (error) {
            console.log("Error: ", error);
        });

    };

});