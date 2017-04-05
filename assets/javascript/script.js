  
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

	// console.log(train);
	// console.log(dest);
	// console.log(firstArrival);
	// console.log(frequency + " freq");

	var timeDiff = moment().diff(moment.unix(firstArrival, "X"), "minutes");

	var nextArr = moment.unix(firstArrival).format("h:mm a");

	

	var nextArr;

	if(timeDiff > 0){

		var freqNum = parseInt(frequency);
		var diffNum = parseInt(timeDiff) ;
		
		var rem = diffNum % freqNum;
		var remainder = freqNum - rem;


		nextArr = moment().add(remainder, "minutes").format("X");

		// console.log(nextArr);

	}
	else{
		nextArr = firstArrival;

		 // console.log(nextArr);
		};

		var adjMinsAway = moment().diff(moment.unix(nextArr, "X"), "minutes") -1;
		var minsAway = 0 - adjMinsAway;

		var nextArrPretty = moment.unix(nextArr).format("h:mm a");
		
		$("#table > tbody").append("<tr><td>" + train + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + nextArrPretty + "</td><td>" + minsAway + "</td></tr>");

	});



$(document).on("click","#delete", function(){
	database.ref().remove();
	$("tbody").empty();

	
});

