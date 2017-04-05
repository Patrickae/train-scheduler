  
//configure firebase

var config = {
	apiKey: "AIzaSyAdEHOdishKsrxIfSTh1t6e9CWUaQP4-0U",
	authDomain: "fir-800c4.firebaseapp.com",
	databaseURL: "https://fir-800c4.firebaseio.com",
	projectId: "fir-800c4",
	storageBucket: "fir-800c4.appspot.com",
	messagingSenderId: "508246552950"
};


firebase.initializeApp(config);

var database = firebase.database();





//when submit is clicked, run function
$("#submit").on("click", function(){

		event.preventDefault();
	//save input values as variables
		var impTrain = $("#train-name").val().trim();
		var impDest = $("#destination").val().trim();
		var impArrTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X");
		var impFrequency = $("#frequency").val().trim();

	// create an object of those variables
		var newImp = {
			train: impTrain,
			dest: impDest,
			firstArrival: impArrTime,
			frequency : impFrequency
		}
		//push that object to firebase

		database.ref().push(newImp);

		//clear inputs
		$("input").val("");

});

//on page load or new child added, display on page


database.ref().on("child_added", function(snapshot){

		console.log(snapshot.val());

		var train = snapshot.val().train;
		var dest = snapshot.val().dest;
		var firstArrival = snapshot.val().firstArrival;
		var frequency = snapshot.val().frequency;

//difference between current time and first arrival in minutes
		var timeDiff = moment().diff(moment.unix(firstArrival, "X"), "minutes");

//next arrival set to format hours : minutes am/pm. first arrival used as placeholder time
		var nextArr = moment.unix(firstArrival).format("h:mm a");

	
// checking if first arrival was in the past
		if(timeDiff > 0){

			var freqNum = parseInt(frequency);
			var diffNum = parseInt(timeDiff) ;
			
			//minutes since first arrival divided by frequency. pulling remainder
			var rem = diffNum % freqNum;

			//subtract the remainder from the original frequency. this will tell you how far away the train is
			var remainder = freqNum - rem;


			nextArr = moment().add(remainder, "minutes").format("X");

			// console.log(nextArr);

		}
		else{

			nextArr = firstArrival;

			 // console.log(nextArr);
			};
			
		//adding one to the minutes away so that it rounds up to the nearest whole minute ()
		var adjMinsAway = moment().diff(moment.unix(nextArr, "X"), "minutes") -1;
			//subtract from zero, because minutes away is negative
		var minsAway = 0 - adjMinsAway;

			//formatting the next arrival time
		var nextArrPretty = moment.unix(nextArr).format("h:mm a");
			//push to the page as a new row 
		$("#table > tbody").append("<tr><td>" + train + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + nextArrPretty + "</td><td>" + minsAway + "</td></tr>");
});


//delete button clicked will clear database and clear the table
$(document).on("click","#delete", function(){
	
		database.ref().remove();
		$("tbody").empty();
	
});

