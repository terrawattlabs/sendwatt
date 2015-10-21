

// Include Cloud Code module dependencies
var express = require('express');
    twilio = require('twilio');

var app = express();

app.use(express.bodyParser());


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


      		var Messages = Parse.Object.extend("Messages");
			var message = new Messages();

			message.set("body", b);
			message.set("type", "incoming");
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
    var accountSid = 'AC73f7249b29a458ccfb05e1ca469023aa';
    var authToken = 'da9c29a9a9ceda42b101242c8b5bfdb9';
    var client = require('twilio')(accountSid, authToken);

    var msgBody = request.params.message;
    var msgTo = request.params.sendTo;


           // Send an SMS message
            client.sendSms({
                to: msgTo, 
                from: '+17204093065', 
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
}); //end notify texts



app.listen();


