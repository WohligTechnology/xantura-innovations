var schema = new Schema({
    email: {
        type: String,
        validate: validators.isEmail()
    },
    tokenKey: {
        type: String,
        default: ""
    },
    requestApproved: {
        type: Boolean,
        default: false
    },
    lastOpened: {
        type: Date
    },
    admin: {
        type: Boolean,
        default: false
    },
    accessToken: {
        type: [String],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
    add: function () {
        var sum = 0;
        _.each(arguments, function (arg) {
            sum += arg;
        });
        return sum;
    },
    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                console.log(err);
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    /**
     * This function get all the media from the id.
     * @param {userId} data
     * @param {callback} callback
     * @returns  that number, plus one.
     */
    getAllMedia: function (data, callback) {

    },

    //login
    generateTokenKey: function (data, callback) {
        data.tokenKey = md5(data.email);
        User.saveData(data, function (err, data) {
            if (err) {
                console.log("err in save", err)
                callback(err, null);
            } else {
                console.log("data in save", data)
                callback(null, data);
            }
        })
    },

    //email verification
    // sendAccess: function (data, callback) {
    //     console.log("Data",data);
    //     async.waterfall([
    //             function (cbWaterfall) {
    //                 User.findOne({
    //                     username: data.username,
    //                     password:data.password
    //                 }).exec(function (err, found) {
    //                     if (err) {
    //                         cbWaterfall(err, null);
    //                     } else {
    //                         if (!_.isEmpty(found)) {
    //                             var foundObj = found.toObject();
    //                             cbWaterfall(null, foundObj);
    //                         } else {
    //                             cbWaterfall("Incorrect Credentials!", null);
    //                         }
    //                     }

    //                 });
    //             },
    //             function (foundObj, cbWaterfall1) {
    //                 var emailData = {};
    //                 console.log("foundObj: ", foundObj);
    //                 console.log("data: ", data);
    //                 emailData.email = foundObj.email;
    //                 emailData.tokenKey = foundObj.tokenKey;
    //                 emailData.from = "innovatives@sptr.co";
    //                 emailData.filename = "verification.ejs";
    //                 emailData.subject = "Welcome to Innovatives";
    //                 emailData._id = foundObj._id;
    //                 console.log("emaildata", emailData);

    //                 Config.email(emailData, function (err, emailRespo) {
    //                     if (err) {
    //                         cbWaterfall1(null, err);
    //                     } else if (emailRespo) {
    //                         cbWaterfall1(null, emailRespo);
    //                     } else {
    //                         cbWaterfall1(null, "Invalid data");
    //                     }
    //                 });
    //             },
    //         ],
    //         function (err, data2) {
    //             if (err) {
    //                 callback(err, null);
    //             } else if (data2) {
    //                 if (_.isEmpty(data2)) {
    //                     callback(err, null);
    //                 } else {
    //                     callback(null, data2);
    //                 }
    //             }
    //         });
    // },

    // Login Using Username & Passowrd
    sendAccess: function (data, callback) {
        User.findOne({
            username: data.username,
            password: data.password
        }, {
            tokenKey: 1
        }).exec(callback);
    },

    verifyToken: function (data, callback) {
        User.findOne({
            tokenKey: data.token,
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (!_.isEmpty(found)) {
                    var foundObj = found.toObject();
                    console.log("founddddddd", foundObj);
                    if (found.requestApproved) {
                        callback(null, foundObj);
                    } else {
                        callback("Request not approved", null);
                    }
                } else {
                    callback("Incorrect Credentials!", null);
                }
            }
        });
    },

    createUser: function (data, callback) {
        var data1 = {};
        data1.tokenKey = md5(data.tokenKey);
        data1.email = data.email;
        User.saveData(data1, function (err, data) {
            console.log("data1", data1);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        })
    },

};
module.exports = _.assign(module.exports, exports, model);