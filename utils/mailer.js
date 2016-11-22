var q = require('q');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporterGmail = nodemailer.createTransport(smtpTransport({
    host: config.mailer.gmailhost,
    port: config.mailer.port,
    auth: {
        user: config.mailer.gmailemail,
        pass: config.mailer.password
    },
    secure: true,
    debug: true
}));

var sendMailFromGmail = function (mailOptions) {
    var deffered = q.defer();
    transporterGmail.sendMail(mailOptions, function (error, info) {
        if (error) {
            deffered.reject(error);
        } else {
            deffered.resolve(true);
        }
    });
    return deffered.promise;
};

var mailer = function () {
};

mailer.sendNotificationMail = function (email, subject, Text) {
    var deffered = q.defer();
    var mailOptions = {
        from: config.mailer.gmailemail,
        to: email,
        subject: subject,
        html: Text
    };
    console.log(mailOptions)
    sendMailFromGmail(mailOptions).then(function (status) {
        deffered.resolve(status);
    }, function (error) {
        deffered.reject(error);
    });
    return deffered.promise;
};

module.exports = mailer;