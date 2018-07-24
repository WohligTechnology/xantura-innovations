var schema = new Schema({
    userEmail: {
        type: String,
        validate: validators.isEmail()
    },
    activityDetail: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('UsageLogs', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    // logActivity: function (data, callback) {
    //     UsageLogs.findOne({
    //         userEmail: data.email,
    //     }).exec(function (err, found) {
    //         console.log("foundddddddd",found);
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             console.log("in if");
    //             if (found == null) {
    //                 console.log("in found");
    //                 var data1 = {};
    //                 data1.activityDetail = [];
    //                 data1.userEmail = data.email;
    //                 data1.activityDetail.push(data.location);
    //                 UsageLogs.saveData(data1, function (err, data) {
    //                     if (err) {
    //                         callback(err, null);
    //                     } else {
    //                         callback(null, data);
    //                     }
    //                 })
    //             } else {
    //                 UsageLogs.update({
    //                     userEmail: data.email
    //                 }, {
    //                     $push: {
    //                         activityDetail: data.location
    //                     }
    //                 }).exec(function (err, data) {
    //                     if (err) {
    //                         callback(err, null);
    //                     } else {
    //                         callback(null, data);
    //                     }
    //                 })
    //             }
    //         }
    //     });
    // }


logActivity: function (data, callback) {
    console.log("data in usagelogs",data);
        UsageLogs.findOne({
            userEmail: data.email,
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                console.log("in if");
                    console.log("in found");
                    var data1 = {};
                    data1.userEmail = data.email;
                    data1.activityDetail = data.activity;
                    UsageLogs.saveData(data1, function (err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data);
                        }
                    })
                } 
        });
    }

};
module.exports = _.assign(module.exports, exports, model);