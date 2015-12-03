

// Include Cloud Code module dependencies
var express = require('express');
    twilio = require('twilio');

var app = express();

var SendGrid = require("sendgrid");  
SendGrid.initialize("customer_ninja", "courthouse1327");

app.use(express.bodyParser());

Parse.Cloud.define("sendEmail", function (request, response) {
         var sendTo = request.params.recipient;
         var sendFrom = request.params.sender;
         var sendSubject = request.params.subject;
         var sendText = request.params.bodyText;
         var sendHTML = request.params.bodyHTML;

         SendGrid.sendEmail({
            to: sendTo,
            from: sendFrom,
            subject: sendSubject,
            text: sendText,
            html: sendHTML
          }, {
            success: function(httpResponse) {
              console.log(httpResponse);
              response.success("Email sent!");
            },
            error: function(httpResponse) {
              console.error(httpResponse);
              response.error("Uh oh, something went wrong");
            }
          });

});


app.post('/api/incomingsms', function (request, response) {
    // Create a TwiML response generator object
    var twiml = new twilio.TwimlResponse();
    var msgfrom = request.body.From;
    var msgbody = request.body.Body;
    
    //console.log(msgfrom);
    //console.log(msgbody);

    var Units = Parse.Object.extend("Units");
	var query = new Parse.Query(Units);
	query.equalTo("phone", msgfrom);
	query.find({
	  success: function(results) {
	    // Do something with the returned Parse.Object values
	   	//postMessage(results[0], msgfrom, msgbody);
	   	console.log(results[0].id);

	   	 Parse.Cloud.run('postMsg', {
                   "b" : msgbody,
                   "from" : msgfrom,
                   "d": "incoming",
                   "unit": results[0].id
                }, {
                  success: function(result) {
                    response.send(200);
                },
                  error: function(error) {
                    //console.log(error);
                  }
                });
	   	
	  },
	  error: function(error) {
	  	console.log(error);
	    //alert("Error: " + error.code + " " + error.message);
	  }
	});




 //    // // add some instructions
	// twiml.message('Thanks dude');

 
 //    // // Render the TwiML XML document
 //    response.type('text/xml');
 //    response.send(twiml.toString());
  
  //

    
});


Parse.Cloud.define("postMsg", function (request, response) {
  			
  			var b = request.params.b;
  			var unread = false;
  			var unit = request.params.unit;
        var d = request.params.d;


      		var Messages = Parse.Object.extend("Messages");
			var message = new Messages();

			message.set("body", b);
			message.set("type", d);
			message.set("unread", true);
			message.set("unit", unit);

			message.save(null, {
			  success: function(msg) {
			   console.log('saved');
			  },
			  error: function(gameScore, error) {
			  	console.log(error);
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			   // alert('Failed to create new object, with error code: ' + error.message);
			  }
			});

});


Parse.Cloud.define("outgoingSMS", function (request, response) {
      // Require and initialize the Twilio module with your credentials
    var accountSid = 'AC0b1f4860568ff4949a1d004724ac2c7d';
    var authToken = '8244d596dd0b71d6a8dfa05f208129bc';
    var client = require('twilio')(accountSid, authToken);

    var msgBody = request.params.message;
    var msgTo = request.params.sendTo;


           // Send an SMS message
            client.sendSms({
                to: msgTo, 
                from: '+17204109010',
                body: msgBody
              }, function (err, responseData) { 
                if (err) {
                  console.log(err);
                } else { 
                  console.log(responseData.from); 
                  console.log(responseData.body);
                  response.success(responseData.body);
                }
              }
            );
}); //end outgoing texts


Parse.Cloud.job("sendWaterSMS", function(request, status) {
   
  var y = "water";
 // start cloud code 
    var Units = Parse.Object.extend("Units");
    var query = new Parse.Query("Units");
    query.equalTo("getmessages", true);

    //filter for only units with phone numbers so we dont get twilio erros
    //query.notEqualTo("phone", "Michael Yabuti");
      query.find({
        success: function(results) {
          console.log(results);
          compileTexts(results, y);
        },
        error: function() {
          response.error("location failed");
        }
      });
});
 

  // for-loop to build each text, run sendText() to actually send off the msg
  function compileTexts (u, y) {

    for (var i = 0; i <= u.length -1; i++) {

      var sendTo = u[i].get('phone');
      var name = u[i].get('name');

      findPosTips(sendTo, name, u[i], y);

    };
  };

  var tipArray = [];

  function findPosTips (sendTo, nm, u, y){

    var Tips = Parse.Object.extend("Tips");

    var utilityQuery = new Parse.Query(Tips);
    utilityQuery.equalTo("utility", y);

    var allQuery = new Parse.Query(Tips);
    allQuery.equalTo("utility", "all");

   

    var query = new Parse.Query.or(utilityQuery, allQuery);
    query.equalTo("direction", "positive");
    query.find({
      success: function(results) {
         var max = results.length - 1;
        var n = getRandomInt(0, max);

        tipArray.push(results[n]);
        findNegTips(sendTo, nm, u, y);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
 
  };

  function findNegTips (sendTo, nm, u, y){

    var Tips = Parse.Object.extend("Tips");

    var utilityQuery = new Parse.Query(Tips);
    utilityQuery.equalTo("utility", y);

    var allQuery = new Parse.Query(Tips);
    allQuery.equalTo("utility", "all");

   

    var query = new Parse.Query.or(utilityQuery, allQuery);
    query.equalTo("direction", "negative");
    query.find({
      success: function(results) {
        var max = results.length - 1;
        var n = getRandomInt(0,max);

        tipArray.push(results[n]);
        getReadingSend(sendTo, nm, u, y); 

        Parse.Cloud.run('sendEmail', {
            "recipient": "jpdean333@gmail.com",
            "sender": "info@customerdiscovery.ninja",
            "subject": "Some information" + new Date(),
            "bodyHTML": "Good Job =  " + tipArray[0].get('body') + "<br> bad job " + tipArray[1].get('body')

        }, {
          success: function(result) {
            // console.log(result);
        
        },
          error: function(error) {
            // console.log(error);
          }
        });

      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
 



 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
 
  function getReadingSend(sendTo, name, u, y) {
       // pull previous reading

       var MeterRead;
       var spanish = u.get('spanish');

       if (y == "elec") {
        MeterRead = Parse.Object.extend("Readings_Elec");
      } if (y == "water") {
        MeterRead = Parse.Object.extend("Readings_Water");
      } if (y == "gas") {
        MeterRead = Parse.Object.extend("Readings_NG");
      };

        var query = new Parse.Query(MeterRead);
        query.equalTo("unit", u);
        query.descending("createdAt");
        query.limit(1);
        query.find({
          success: function(reading) {
            console.log('in the success block');
            console.log(reading);

            var daily = (reading[0].get('per_day_consumption')).toFixed(2);
            var monthly = (reading[0].get('per_month_consumption')).toFixed(0);
            var multiple = reading[0].get('multiple_from_prev');



            var percentage = getPercentage(multiple);
            var percHelper = getHelper(multiple, spanish);
            var customMsg = getTip(multiple, spanish);
            var body = compileMessage(name, daily, monthly, percentage, percHelper, customMsg, spanish);

            sendMessage(sendTo, body);
      
          },
          error: function(object, error) {
            console.log(error);
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
          }
        });
       
  };

function getPercentage (m) {
  var perc;
if (m >= 1) {
    perc = ((m -1) * 100).toFixed(0);
    
  } else {
    perc = ((1 - m) * 100).toFixed(0);
  };
  return perc;
};

function getHelper(m, sp){

  var help;

  if (m >= 1 && sp == true) {
    help = "mas";
  } if (m >= 1 && sp == false) {
    help = "higher";
  };

  if (m < 1 && sp == true) {
    help = "menos";
  } if (m <1 && sp == false) {
    help = "lower";
  };

  return help;

};

function getTip (m,sp) {
  var tip;
   if (m >= 1 && sp == true) {
    tip = tipArray[1].get('spanish');
  } if (m >= 1 && sp == false) {
    tip = tipArray[1].get('body');
  };

  if (m < 1 && sp == true) {
    tip = tipArray[0].get('spanish');
  } if (m <1 && sp == false) {
    tip = tipArray[0].get('body');
  };

  return tip;
};


function compileMessage(n, d, m, p, h, t, s) {
        var b;
            if (s == true) {
              b = n + ", tu casa esta usar $" + 
              d + 
              "/dia de agua. Esta aproxima $" +
              m +
              "/mo. y " +
              p +
              "% " +
              h +
              " de yesterdia. " +
              t;
            } else {
              b = n + ", your home has been using $" + 
              d + 
              "/day of water. That's about $" +
              m +
              "/mo. and " +
              p +
              "% " +
              h +
              " than last measured. " +
              t;
            };
          return b;
};

function sendMessage(to, body) {
  Parse.Cloud.run('outgoingSMS', {
                  "sendTo" : to,
                  "message": body
                }, {
                  success: function(result) {
                    console.log(result);
                },
                  error: function(error) {
                    //console.log(error);
                  }
                });

};


  function postMessage (body, d, u){
    Parse.Cloud.run('postMsg', {
                   "b" : body,
                   "from" : '+17204109010',
                   "d": d,
                   "unit": u
                }, {
                  success: function(result) {
                    response.send(200);
                },
                  error: function(error) {
                    //console.log(error);
                  }
                });
  };



app.listen();


