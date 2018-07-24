var schema = new Schema({
    rating: {
        type: Number
    },
    comment: {
        type: String
    },
    userEmail: {
        type: String,
        validate: validators.isEmail()
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Feedback', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    feedback: function (data, callback) {
        async.waterfall([
                function (cbWaterfall) {
                    Feedback.saveData(data, function (err, complete) {
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
                    }];
                    if (data.rating != undefined) {
                        emailData.rating = data.rating;
                    } else {
                        emailData.a = true;
                        emailData.rating = "";
                    }

                    emailData.comment = data.comment;
                    emailData.from = data.userEmail;
                    emailData.project = data.project;
                    emailData.filename = "feedback.ejs";
                    emailData.subject = "Innovatives - Feedback";
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
    }


};
module.exports = _.assign(module.exports, exports, model);