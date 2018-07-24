module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    projectDetail: function (req, res) {
        if (req.body) {
            Projects.projectDetail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    projectList: function (req, res) {
        Projects.projectList(req.body, res.callback);
    },
    all: function (req, res) {
        Projects.all(req.body, res.callback);
    },
    featuredProjects: function (req, res) {
        Projects.featuredProjects(req.body, res.callback);
    },
    requestDemo: function (req, res) {
        Projects.requestDemo(req.body, res.callback);
    },
};
module.exports = _.assign(module.exports, controller);