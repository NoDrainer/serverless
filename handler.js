'use strict';

var AWS = require('aws-sdk')
var ses = new AWS.SES();

var SENDER = process.env.sender;
var RECEIVER = process.env.receiver;

module.exports.contact = (event, context, callback) => {
  let req = JSON.parse(event.body);
  sendEmail(req, function (err, data) {
    if (err) {
      callback(err);
    } else {
      var res = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: 'Email sent',
        })
      };
      callback(null, res);
    }
  });
};

function sendEmail(event, done) {
  var params = {
    Destination: {
      ToAddresses: [RECEIVER]
    },
    Message: {
      Body: {
        Text: {
          Data: 'Name: ' + event.name + '\nEmail: ' + event.email + '\nMessage: ' + event.message,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: 'NoDrainer - ' + event.name + ': ' + event.subject,
        Charset: 'UTF-8'
      }
    },
    Source: SENDER
  };
  ses.sendEmail(params, done);
}
