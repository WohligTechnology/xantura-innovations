var schema = new Schema({
    userEmail: {
        type: String,
        validate: validators.isEmail()
    },
    name: {
        type: String
    },
    number: {
        type: String
    },
    comments: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Contact', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    contactUs: function (data, callback) {
        async.waterfall([
                function (cbWaterfall) {
                    Contact.saveData(data, function (err, complete) {
                        if (err) {
                            cbWaterfall(err, null);
                        } else {
                            if (_.isEmpty(complete)) {
                                cbWaterfall(null, []);
                            } else {
                                console.log("complete", complete);
                                cbWaterfall(null, complete);
                            }
                        }
                    });
                },
                function (complete, cbWaterfall1) {
                    var emailData = {};
                    emailData.a = false;
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
                    emailData.name = data.name;

                    if (data.number != undefined) {
                        emailData.number = data.number;
                    } else {
                        emailData.a = true;
                        emailData.number = "";
                    }
                    emailData.comments = data.comments;
                    emailData.from = data.userEmail;
                    emailData.filename = "contactUs.ejs";
                    emailData.subject = "Innovatives - Meeting Requested";
                    emailData._id = complete._id;
                    console.log("emaildata", emailData);

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
                    callback(null, []);
                } else if (data2) {
                    if (_.isEmpty(data2)) {
                        callback(null, []);
                    } else {
                        callback(null, data2);
                    }
                }
            });
    },

};
module.exports = _.assign(module.exports, exports, model);