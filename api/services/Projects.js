var schema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        enum: ["TUI Projects", "Innovative PoC", "Potential PoC", "More Innovations"],
        default: 'TUI Projects'
    },
    description: {
        type: String
    },
    demoLink: {
        type: String
    },
    punchLine: {
        type: String
    },
    shortDescription: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    bannerImage: {
        type: String
    },
    details: {
        type: String
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Projects', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    projectDetail: function (data, callback) {
        console.log("data in project deatail", data)
        Projects.findOne({
            _id: data._id
        }).deepPopulate("").exec(function (err, found) {
            if (err) {
                console.log('err', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    projectList: function (data, callback) {
        Projects.find({
            type: data.type
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },

    all: function (data, callback) {
        Projects.find().exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },

    featuredProjects: function (data, callback) {
        Projects.find({
            featured: true
        }).exec(function (err, data) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, data)
            }
        });
    },



    requestDemo: function (data, callback) {
        console.log("inside requestDemo", data)
        async.waterfall([
                function (cbWaterfall) {
                    User.findOne({
                        tokenKey: data.tokenKey,
                    }).exec(function (err, found) {
                        if (err) {
                            cbWaterfall(err, null);
                        } else {
                            if (!_.isEmpty(found)) {
                                var foundObj = found.toObject();
                                delete foundObj.password;
                                cbWaterfall(null, foundObj);
                            } else {
                                cbWaterfall("Incorrect Credentials!", null);
                            }
                        }

                    });
                },
                function (foundObj, cbWaterfall1) {
                    var emailData = {};
                    console.log("data: ", data);
                    emailData.email = [{
                        "email": "tushar.sachde@sptr.co"
                    }, {
                        "email": "tushar@wohlig.com"
                    }, {
                        "email": "anand@sptr.co"
                    }, {
                        "email": "vivek@sptr.co"
                    }];
                    emailData.projectName = data.project.projectName;
                    emailData.name = data.project.name;
                    emailData.number = data.project.number;
                    emailData.from = data.project.userEmail;
                    emailData.filename = "demorequest.ejs";
                    emailData.subject = "Innovatives - Demo Requested";
                    emailData._id = foundObj._id;

                    Config.email(emailData, function (err, emailRespo) {
                        if (err) {
                            console.log(err);
                            cbWaterfall1(null, err);
                        } else if (emailRespo) {
                            cbWaterfall1(null, emailRespo);
                        } else {
                            cbWaterfall1(null, "Invalid data");
                        }
                    });
                },
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(err, null);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },
};
module.exports = _.assign(module.exports, exports, model);