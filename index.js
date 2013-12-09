#!/usr/bin/env node
var request = require('request');
var checksum = require('checksum');
var nodemailer = require("nodemailer");
var nconf = require('nconf');
var lastHash, newHash;

nconf.env().argv();
nconf.file(nconf.get("config"));

// var schedule = require('node-schedule');

// var j = schedule.scheduleJob('*/1 * * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
// });

var notifyMe = function(subject, message) {

  var date = new Date();
  message = date + " " + message;

  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
      user: nconf.get('email-account'),
      pass: nconf.get('email-password')
    }
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: nconf.get('email-from'),
    to: nconf.get('email-addresses'),
    subject: subject,
    text: message,
    html: message
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) console.log(error);
    smtpTransport.close(); // shut down the connection pool, no more messages
  });

}

var pingSite = function() {

  request(nconf.get('website'), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      newHash = checksum(body);
      if (newHash === lastHash) {
        console.log(newHash);
      } else {
        notifyMe("Rosegirls Update", "The page has changed.");
      }
      lastHash = newHash;
    }
    setTimeout(pingSite, (60000 * 30)); // 30 mins
  })
}

pingSite();